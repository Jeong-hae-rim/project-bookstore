const conn = require("../db");
const { StatusCodes } = require("http-status-codes");
const { decodedJWT } = require("../helper");


const readAllOrder = async (req, res) => {
    const authorization = decodedJWT(req, res);

    let sql = `SELECT 
    ORDERS_TB.id, created_at, receiver, contact, address, book_title, total_amount, total_price 
    FROM ORDERS_TB LEFT JOIN DELIVERY_TB ON ORDERS_TB.delivery_id = DELIVERY_TB.id WHERE user_id = ?`;

    try {
        let [results, fields] = await conn.query(sql, [authorization.id]);

        return (results !== undefined && results !== null && results.length > 0) ?
            res.status(StatusCodes.OK).json(results) :
            res.status(StatusCodes.OK).json([]);
    } catch (error) {
        console.error("Error reading orders:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

const addToOrder = async (req, res) => {
    const { items, delivery, total_amount, total_price, first_book_title } = req.body;
    const authorization = decodedJWT(req, res);

    // CART_ITEMS_TB SELECT id 조건절
    let cartItemSql = "SELECT book_id, amount FROM CART_ITEMS_TB WHERE id IN (?)";

    // DELIVERY_TB INSERT (DELIVERY_TB id 있어야 함)
    let deliverySql = "INSERT INTO DELIVERY_TB (address, receiver, contact) VALUES (?, ?, ?)";
    let deliveryValues = [delivery.address, delivery.receiver, delivery.contact];

    // ORDERS_TB INSERT (ORDERS_TB id 있어야 함)
    let ordersSql = `INSERT INTO ORDERS_TB (book_title, total_amount, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)`;
    let ordersValues = [first_book_title, total_amount, total_price, authorization.id];

    // ORDERED_BOOKS_TB INSERT (가장 마지막에 되어야 함)
    let orderedBooksSql = `INSERT INTO ORDERED_BOOKS_TB (order_id, book_id, amount) VALUES ?`;
    let orderedBooksValues = [];

    // 쿼리 실행
    try {

        const [cartItemsResults, fields] = await conn.query(cartItemSql, [items]);
        await errorInsertSQL(cartItemsResults, 'cartItemSql', conn, res);

        const [deliveryResults, fields2] = await conn.query(deliverySql, deliveryValues);
        await errorInsertSQL(deliveryResults.affectedRows, 'deliverySql', conn, res);

        const [orderResults, fields3] = await conn.query(ordersSql, [...ordersValues, deliveryResults.insertId]);
        await errorInsertSQL(orderResults.affectedRows, 'ordersSql', conn, res);

        cartItemsResults.forEach((item) => {
            orderedBooksValues.push([orderResults.insertId, item.book_id, item.amount]);
        });

        const [orderedBooksResult, fields4] = await conn.query(orderedBooksSql, [orderedBooksValues]);
        await errorInsertSQL(orderedBooksResult.affectedRows, 'orderedBooksSql', conn, res);

        const [cartRemoveResults, fields5] = await removeToCartItem(items);
        await errorInsertSQL(cartRemoveResults.affectedRows, 'cartRemoveSql', conn, res);

        return res.status(StatusCodes.OK).json({
            deliveryResults,
            orderResults,
            orderedBooksResult,
            cartRemoveResults
        });
    } catch (error) {
        console.error("Transaction failed:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

const errorInsertSQL = async (results, queryName, conn, res) => {
    if (results === 0 || !results) {
        console.error(`Error in ${queryName} query`);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

const removeToCartItem = async (items) => {
    decodedJWT(req, res);

    let sql = "DELETE FROM CART_ITEMS_TB WHERE id IN (?)";
    try {
        return await conn.query(sql, [items]);
    } catch (error) {
        console.error("Error removing items from cart:", error);
        throw error;
    }
}

const readDetailOrder = async (req, res) => {
    decodedJWT(req, res);
    const { id } = req.params;

    let sql = `SELECT 
    book_id, title, author, price, amount 
    FROM ORDERED_BOOKS_TB LEFT JOIN BOOKS_TB ON ORDERED_BOOKS_TB.book_id = BOOKS_TB.id 
    WHERE order_id = ?`;

    try {
        const [results, fields] = await conn.query(sql, [parseInt(id)]);

        return (results !== undefined && results !== null && results.length > 0) ?
            res.status(StatusCodes.OK).json(results) :
            res.status(StatusCodes.OK).json([]);
    } catch (error) {
        console.error("Error reading orders detail:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

module.exports = {
    readAllOrder,
    addToOrder,
    readDetailOrder
}