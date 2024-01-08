const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");

const allReadCartItems = (req, res) => {
    res.json({ message: "장바구니 조회" })
}

const addToCarts = (req, res) => {
    const { book_id, amount, user_id } = req.body;

    let sql = "INSERT INTO CART_ITEMS_TB (book_id, amount, user_id) VALUES (?, ?, ?)";

    conn.query(sql, [parseInt(book_id), parseInt(amount), parseInt(user_id)], (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: err
            })
        }

        if (results.affectedRows === 0) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        } else {
            return res.status(StatusCodes.OK).json(results);
        }
    })
}

const removeToCarts = (req, res) => {
    res.json({ message: "장바구니 도서 삭제" })
}

module.exports = {
    allReadCartItems,
    addToCarts,
    removeToCarts
}