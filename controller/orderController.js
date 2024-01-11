const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");


const readAllOrder = async (req, res) => {
    let sql = `SELECT 
    ORDERS_TB.id, created_at, receiver, contact, address, book_title, total_amount, total_price 
    FROM ORDERS_TB LEFT JOIN DELIVERY_TB ON ORDERS_TB.delivery_id = DELIVERY_TB.id`;

    let [results, fields] = await conn.query(sql);

    if (results) {
        res.status(StatusCodes.OK).json(results);
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

const addToOrder = async (req, res) => {
    const { items, delivery, total_amount, total_price, user_id, first_book_title } = req.body;

    // CART_ITEMS_TB SELECT id 조건절
    let cartItemSql = "SELECT book_id, amount FROM CART_ITEMS_TB WHERE id IN (?)";
    let [cartItemsResults, fields] = await conn.query(cartItemSql, [items]);

    // DELIVERY_TB INSERT (DELIVERY_TB id 있어야 함)
    let deliverySql = "INSERT INTO DELIVERY_TB (address, receiver, contact) VALUES (?, ?, ?)";
    let deliveryValues = [delivery.address, delivery.receiver, delivery.contact];

    // ORDERS_TB INSERT (ORDERS_TB id 있어야 함)
    let ordersSql = `INSERT INTO ORDERS_TB (book_title, total_amount, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)`;
    let ordersValues = [first_book_title, total_amount, total_price, user_id];

    // ORDERED_BOOKS_TB INSERT (가장 마지막에 되어야 함)
    let orderedBooksSql = `INSERT INTO ORDERED_BOOKS_TB (order_id, book_id, amount) VALUES ?`;
    let orderedBooksValues = [];

    // 쿼리 실행
    try {
        const [deliveryResults, fields2] = await conn.query(deliverySql, deliveryValues);
        await errorInsertSQL(deliveryResults.affectedRows, conn, res);

        const [orderResults, fields3] = await conn.query(ordersSql, [...ordersValues, deliveryResults.insertId]);
        await errorInsertSQL(orderResults.affectedRows, conn, res);

        cartItemsResults.forEach((item) => {
            orderedBooksValues.push([orderResults.insertId, item.book_id, item.amount]);
        });

        const [orderedBooksResult, fields4] = await conn.query(orderedBooksSql, [orderedBooksValues]);
        await errorInsertSQL(orderedBooksResult.affectedRows, conn, res);

        const [cartRemoveResults, fields5] = await removeToCartItem(items);
        await errorInsertSQL(cartRemoveResults.affectedRows, conn, res);

        res.status(StatusCodes.OK).json({ deliveryResults, orderResults, orderedBooksResult, cartRemoveResults });
    } catch (error) {
        console.error("Transaction failed:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

const errorInsertSQL = async (affectedRows, conn, res) => {
    if (affectedRows === 0) {
        await conn.rollback();
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

const removeToCartItem = async (items) => {
    let sql = "DELETE FROM CART_ITEMS_TB WHERE id IN (?)";

    return [results, fields] = await conn.query(sql, [items]);
}

const readDetailOrder = async (req, res) => {
    const { id } = req.params;

    let sql = `SELECT 
    book_id, title, author, price, amount 
    FROM ORDERED_BOOKS_TB LEFT JOIN BOOKS_TB ON ORDERED_BOOKS_TB.book_id = BOOKS_TB.id 
    WHERE order_id = ?`;

    let [results, fields] = await conn.query(sql, parseInt(id));

    if (results) {
        res.status(StatusCodes.OK).json(results);
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

module.exports = {
    readAllOrder,
    addToOrder,
    readDetailOrder
}