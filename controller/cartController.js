const conn = require("../db");
const { StatusCodes } = require("http-status-codes");
const { decodedJWT } = require("../utils");

const allReadCartItems = async (req, res) => {
    const { selected } = req.body;
    const decoded = decodedJWT(req, res);

    let sql = `SELECT CART_ITEMS_TB.id, book_id, title, summary, amount, price 
                    FROM CART_ITEMS_TB LEFT JOIN BOOKS_TB 
                    ON CART_ITEMS_TB.book_id = BOOKS_TB.id
                    WHERE user_id = ? `;

    if (selected.length > 0) {
        sql += "AND CART_ITEMS_TB.id IN (?)"
    }

    try {
        let [results, fields] = await conn.query(sql, [decoded.id, selected]);

        const formattedResults = results.map(result => ({
            id: result.id,
            bookId: result.book_id,
            title: result.title,
            summary: result.summary,
            amount: result.amount,
            price: result.price
        }));

        return (results !== undefined && results !== null && results.length > 0) ?
            res.status(StatusCodes.OK).json(formattedResults) :
            res.status(StatusCodes.OK).json([]);
    } catch (error) {
        console.error("Error reading cart lists:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

const addToCarts = async (req, res) => {
    const { bookId, amount } = req.body;
    const decoded = decodedJWT(req, res);

    let sql = "INSERT INTO CART_ITEMS_TB (book_id, amount, user_id) VALUES (?, ?, ?)";

    try {
        let [results, fields] = await conn.query(sql, [parseInt(bookId), parseInt(amount), decoded.id]);

        if (results.affectedRows === 0) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        } else {
            return res.status(StatusCodes.OK).json(results);
        }
    } catch (error) {
        console.error("Error add cart item:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

//id 단일로 들어올 때와 items(배열)이 들어올 때 두 경우를 나누어 처리
const removeToCarts = async (req, res, items) => {
    const { id } = req.params;
    decodedJWT(req, res);

    let sql = "";
    let value = [];

    try {

        if (id) {
            sql = "DELETE FROM CART_ITEMS_TB WHERE id = ?";
            value = [parseInt(id)];

            let [results, fields] = await conn.query(sql, value);

            if (results.affectedRows === 0) {
                return res.status(StatusCodes.BAD_REQUEST).end();
            } else {
                return res.status(StatusCodes.OK).json(results);
            }
        } else {
            sql = "DELETE FROM CART_ITEMS_TB WHERE id IN (?)";
            value = [items];

            return await conn.query(sql, value);
        }

    } catch (error) {
        console.error("Error remove cart item:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }

}

module.exports = {
    allReadCartItems,
    addToCarts,
    removeToCarts
}