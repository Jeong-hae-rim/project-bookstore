const conn = require("../db");
const { StatusCodes } = require("http-status-codes");
const { decodedJWT } = require("../helper");

const allReadBooks = async (req, res) => {
    const { category_id, recent, limit, currentPage } = req.query;
    let offset = (parseInt(currentPage) - 1) * parseInt(limit);
    let values = [];
    let likeSql = "SELECT count(*) FROM LIKES_TB WHERE liked_book_id = BOOKS_TB.id";
    let sql = `SELECT *, (${likeSql}) AS likes FROM BOOKS_TB`;

    if (category_id && recent) {
        sql += " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
        values = [parseInt(category_id)];
    } else if (category_id) {
        sql += " WHERE category_id = ?";
        values = [parseInt(category_id)];
    } else if (recent) {
        sql += " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    }

    sql += " LIMIT ? OFFSET ?";
    values = [...values, parseInt(limit), parseInt(offset)];

    try {
        let [results, fields] = await conn.query(sql, values);

        if (results.length) {
            return res.status(StatusCodes.OK).json(results);
        } else {
            return res.status(StatusCodes.NOT_FOUND).json([]);
        }
    } catch (error) {
        console.error("Error reading book detail:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}


const detailReadBook = async (req, res) => {
    const { id } = req.params;
    const authorization = decodedJWT(req, res);

    let sql = "";
    let value = [];
    let likeSql = "SELECT count(*) FROM LIKES_TB WHERE liked_book_id = BOOKS_TB.id";
    let isLikeSql = "SELECT EXISTS (SELECT * FROM LIKES_TB WHERE user_id = ? AND liked_book_id = ?)";

    if (!authorization) {
        sql = `SELECT *, (${likeSql}) AS likes FROM BOOKS_TB LEFT JOIN CATEGORIES_TB ON BOOKS_TB.category_id = CATEGORIES_TB.category_id WHERE BOOKS_TB.id = ?`;
        value = [parseInt(id), parseInt(id)];
    } else {
        sql = `SELECT *, (${likeSql}) AS likes, (${isLikeSql}) AS isLiked FROM BOOKS_TB LEFT JOIN CATEGORIES_TB ON BOOKS_TB.category_id = CATEGORIES_TB.category_id WHERE BOOKS_TB.id = ?`;
        value = [authorization.id, parseInt(id), parseInt(id)];
    }

    try {
        let [results, fields] = await conn.query(sql, value);

        if (results.length) {
            return res.status(StatusCodes.OK).json(results);
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({
                massage: "존재하지 않는 도서입니다."
            });
        }
    } catch (error) {
        console.error("Error reading book detail:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

module.exports = {
    allReadBooks,
    detailReadBook
}