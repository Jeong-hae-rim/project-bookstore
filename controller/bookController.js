const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");

const allReadBooks = (req, res) => {
    const { category_id, recent, limit, currentPage } = req.query;
    let offset = (parseInt(currentPage) - 1) * parseInt(limit);
    let sql = "SELECT * FROM books";
    let values = [];

    if (category_id && recent) {
        sql += " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
        values = [parseInt(category_id)];
        // recent 값을 boolean으로 변환하여 추가
    } else if (category_id) {
        sql += " WHERE category_id = ?";
        values = [parseInt(category_id)];
    } else if (recent) {
        sql += " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    }

    sql += " LIMIT ? OFFSET ?";
    values = [...values, parseInt(limit), parseInt(offset)];

    conn.query(sql, values, (err, results) => {
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