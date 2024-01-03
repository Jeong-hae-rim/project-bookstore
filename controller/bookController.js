const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");

const allBooks = (req, res) => {
    let sql = "SELECT * FROM books";

    conn.query(sql, (err, results) => {
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

const detailBook = (req, res) => {
    const { id } = req.params;

    let sql = "SELECT * FROM books WHERE id = ?";

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

const categoryOfBooks = (req, res) => {
    res.json({ message: "개별 카테고리 별 도서 조회" })
}

module.exports = {
    allBooks,
    detailBook,
    categoryOfBooks
}