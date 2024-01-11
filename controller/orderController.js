const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");


const readAllOrder = (req, res) => {
    res.json({ message: "결제 상품 전체 조회" })
}

const addToOrder = async (req, res) => {
    const { items, delivery, total_amount, total_price, user_id, first_book_title } = req.body;

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
    const [deliveryResults, fields] = await conn.query(deliverySql, deliveryValues);
    const [orderResults, fields2] = await conn.query(ordersSql, [...ordersValues, deliveryResults.insertId]);

    items.forEach((item) => {
        orderedBooksValues.push([orderResults.insertId, item.book_id, item.amount]);
    });

    const [orderedBooksResult, fields3] = await conn.query(orderedBooksSql, [orderedBooksValues]);

    if (orderedBooksResults.affectedRows === 0) {
        return res.status(StatusCodes.BAD_REQUEST).end();
    } else {
        res.status(StatusCodes.OK).json({ deliveryResults, orderResults, orderedBooksResult });
    }
}

const readDetailOrder = (req, res) => {
    res.json({ message: "결제 상품 상세 조회" })
}

module.exports = {
    readAllOrder,
    addToOrder,
    readDetailOrder
}