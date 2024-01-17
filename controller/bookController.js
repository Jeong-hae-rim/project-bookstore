const conn = require("../db");
const { StatusCodes } = require("http-status-codes");
const { decodedJWT } = require("../helper");

const allReadBooks = async (req, res) => {
    const { categoryId, recent, limit, currentPage } = req.query;
    let offset = (parseInt(currentPage) - 1) * parseInt(limit);
    let values = [];
    let likeSql = "SELECT count(*) FROM LIKES_TB WHERE liked_book_id = BOOKS_TB.id";
    let sql = `SELECT SQL_CALC_FOUND_ROWS *, (${likeSql}) AS likes FROM BOOKS_TB`;
    let countSql = "SELECT found_rows() AS counts";

    if (categoryId && recent) {
        sql += " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
        values = [parseInt(categoryId)];
    } else if (categoryId) {
        sql += " WHERE category_id = ?";
        values = [parseInt(categoryId)];
    } else if (recent) {
        sql += " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    }

    sql += " LIMIT ? OFFSET ?";
    values = [...values, parseInt(limit), parseInt(offset)];

    try {
        let [results, fields] = await conn.query(sql, values);
        let [countResults, fields2] = await conn.query(countSql);

        let pagination = {
            totalCount: countResults[0].counts,
            currentPage: currentPage
        }

        const formattedResults = results.map(result => ({
            id: result.id,
            categoryId: result.category_id,
            title: result.title,
            img: result.img,
            form: result.form,
            isbn: result.isbn,
            summary: result.summary,
            detail: result.detail,
            author: result.author,
            contents: result.contents,
            pages: result.pages,
            price: result.price,
            likes: result.likes,
            pubDate: result.pub_date
        }));

        if (results !== undefined && results !== null && results.length > 0) {
            return res.status(StatusCodes.OK).json({
                books: formattedResults,
                pagination
            });
        } else {
            return res.status(StatusCodes.OK).json({
                books: [],
                pagination
            });
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

        const formattedResults = results.map(result => ({
            id: result.id,
            categoryId: result.category_id,
            title: result.title,
            img: result.img,
            form: result.form,
            isbn: result.isbn,
            summary: result.summary,
            detail: result.detail,
            author: result.author,
            contents: result.contents,
            pages: result.pages,
            price: result.price,
            likes: result.likes,
            isLiked: result.isLiked,
            pubDate: result.pub_date
        }));

        if (results.length) {
            return res.status(StatusCodes.OK).json(formattedResults);
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