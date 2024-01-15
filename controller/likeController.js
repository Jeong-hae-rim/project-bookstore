const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");
const { decodedJWT } = require("../helper");
const { TokenExpiredError } = require("jsonwebtoken");

const addLike = async (req, res) => {
    const { id } = req.params;
    const decoded = decodedJWT(req);

    if (decoded instanceof TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "로그인 세션이 만료되었습니다. 다시 로그인해 주세요."
        })
    }

    if (decoded instanceof JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message": "잘못된 토큰입니다."
        })
    }

    let sql = "INSERT INTO LIKES_TB (user_id, liked_book_id) VALUES (?, ?)";

    let [results, fields] = await conn.query(sql, [decoded.id, parseInt(id)]);

    if (results.affectedRows === 0) {
        return res.status(StatusCodes.BAD_REQUEST).end();
    } else {
        return res.status(StatusCodes.OK).json(results);
    }
};

const removeLike = async (req, res) => {
    const { id } = req.params;
    const decoded = decodedJWT(req);

    if (decoded instanceof TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "로그인 세션이 만료되었습니다. 다시 로그인해 주세요."
        })
    }

    if (decoded instanceof JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message": "잘못된 토큰입니다."
        })
    }

    let sql = "DELETE FROM LIKES_TB WHERE user_id = ? AND liked_book_id = ?";

    let [results, fields] = await conn.query(sql, [decoded.id, parseInt(id)]);

    if (results.affectedRows === 0) {
        return res.status(StatusCodes.BAD_REQUEST).end();
    } else {
        return res.status(StatusCodes.OK).json(results);
    }
};

module.exports = { addLike, removeLike }