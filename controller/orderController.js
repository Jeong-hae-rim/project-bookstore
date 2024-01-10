const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");


const readAllOrder = (req, res) => {
    res.json({ message: "결제 상품 전체 조회" })
}

const addToOrder = (req, res) => {
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
    conn.query(deliverySql, deliveryValues, (err, deliveryResults) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: err
            });
        }

        // 결과에서 delivery_id를 가져올 수 있으면 가져오기
        const delivery_id = deliveryResults.insertId;

        // ORDERS_TB 쿼리 계속 진행
        conn.query(ordersSql, [...ordersValues, delivery_id], (err, ordersResults) => {
            if (err) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: err
                });
            }

            // 결과에서 order_id를 가져올 수 있으면 가져오기
            const order_id = ordersResults.insertId;

            // ORDERED_BOOKS_TB 쿼리 계속 진행
            items.forEach((item) => {
                orderedBooksValues.push([order_id, item.book_id, item.amount]);
            });

            conn.query(orderedBooksSql, [orderedBooksValues], (err, orderedBooksResults) => {
                if (err) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        message: err
                    });
                }

                if (orderedBooksResults.affectedRows === 0) {
                    return res.status(StatusCodes.BAD_REQUEST).end();
                } else {
                    return res.status(StatusCodes.OK).json(orderedBooksResults);
                }
            });
        });
    });
}

const readDetailOrder = (req, res) => {
    res.json({ message: "결제 상품 상세 조회" })
}

module.exports = {
    readAllOrder,
    addToOrder,
    readDetailOrder
}