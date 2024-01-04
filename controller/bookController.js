const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");

const allReadBooks = (req, res) => {
    const { category_id } = req.query;
    let categoryReadSql = "SELECT * FROM books WHERE category_id = ?";
    let allReadSql = "SELECT * FROM books";

    if (category_id) {

        conn.query(categoryReadSql, parseInt(category_id), (err, results) => {
            if (err) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: err
                })
            }

            const book = results[0];

            if (book) {
                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.NOT_FOUND).json({
                    massage: "존재하지 않는 도서입니다."
                });
            }
        })
    } else {
        conn.query(allReadSql, (err, results) => {
            if (err) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: err
                })
            }

            const books = results[0];

            if (books) {
                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
        })
    }

}

const detailReadBook = (req, res) => {
    const { id } = req.params;

    let sql = `SELECT * FROM books 
            LEFT JOIN categories ON books.category_id = categories.id
            WHERE books.id = ?`;

    conn.query(sql, parseInt(id), (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: err
            })
        }

        const book = results[0];

        if (book) {
            return res.status(StatusCodes.OK).json(results);
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({
                massage: "존재하지 않는 도서입니다."
            });
        }
    })
}

module.exports = {
    allReadBooks,
    detailReadBook
}