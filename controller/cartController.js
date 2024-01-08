const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");

const allReadCartItems = (req, res) => {
    const { user_id, selected } = req.body;

    let allReadSql = `SELECT CART_ITEMS_TB.id, book_id, title, summary, amount, price 
                    FROM CART_ITEMS_TB LEFT JOIN BOOKS_TB 
                    ON CART_ITEMS_TB.book_id = BOOKS_TB.id
                    WHERE user_id = ? `;

    if (selected) {
        allReadSql += "AND CART_ITEMS_TB.book_id IN (?)"
    }

    conn.query(allReadSql, [parseInt(user_id), selected], (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: err
            })
        }

        if (results[0]) {
            return res.status(StatusCodes.OK).json(results);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    })
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
    const { id } = req.params;

    let sql = "DELETE FROM CART_ITEMS_TB WHERE id = ?";

    conn.query(sql, parseInt(id), (err, results) => {
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

module.exports = {
    allReadCartItems,
    addToCarts,
    removeToCarts
}