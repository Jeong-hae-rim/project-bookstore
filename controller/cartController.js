const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");

const allReadCartItems = async (req, res) => {
    const { user_id, selected } = req.body;

    let sql = `SELECT CART_ITEMS_TB.id, book_id, title, summary, amount, price 
                    FROM CART_ITEMS_TB LEFT JOIN BOOKS_TB 
                    ON CART_ITEMS_TB.book_id = BOOKS_TB.id
                    WHERE user_id = ? `;

    if (selected) {
        sql += "AND CART_ITEMS_TB.book_id IN (?)"
    }

    let [results, fields] = await conn.query(sql, [parseInt(user_id), selected]);

    if (results[0]) {
        return res.status(StatusCodes.OK).json(results);
    } else {
        return res.status(StatusCodes.NOT_FOUND).end();
    }
}

const addToCarts = async (req, res) => {
    const { book_id, amount, user_id } = req.body;

    let sql = "INSERT INTO CART_ITEMS_TB (book_id, amount, user_id) VALUES (?, ?, ?)";

    let [results, fields] = await conn.query(sql, [parseInt(book_id), parseInt(amount), parseInt(user_id)]);

    if (results.affectedRows === 0) {
        return res.status(StatusCodes.BAD_REQUEST).end();
    } else {
        return res.status(StatusCodes.OK).json(results);
    }
}

const removeToCarts = async (req, res) => {
    const { id } = req.params;

    let sql = "DELETE FROM CART_ITEMS_TB WHERE id = ?";

    let [results, fields] = await conn.query(sql, [parseInt(id)]);

    if (results.affectedRows === 0) {
        return res.status(StatusCodes.BAD_REQUEST).end();
    } else {
        return res.status(StatusCodes.OK).json(results);
    }
}

module.exports = {
    allReadCartItems,
    addToCarts,
    removeToCarts
}