const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const addLike = async (req, res) => {
    const { id } = req.params;
    const receivedJwt = req.headers["authorization"];
    let decodedUserInfo = jwt.decode(receivedJwt, process.env.PRIVATE_KEY);

    let sql = "INSERT INTO LIKES_TB (user_id, liked_book_id) VALUES (?, ?)";

    let [results, fields] = await conn.query(sql, [decodedUserInfo.id, parseInt(id)]);

    if (results.affectedRows === 0) {
        return res.status(StatusCodes.BAD_REQUEST).end();
    } else {
        return res.status(StatusCodes.OK).json(results);
    }
};

const removeLike = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    let sql = "DELETE FROM LIKES_TB WHERE user_id = ? AND liked_book_id = ?";

    let [results, fields] = await conn.query(sql, [user_id, parseInt(id)]);

    if (results.affectedRows === 0) {
        return res.status(StatusCodes.BAD_REQUEST).end();
    } else {
        return res.status(StatusCodes.OK).json(results);
    }
};

module.exports = { addLike, removeLike }