const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { StatusCodes } = require("http-status-codes");
const { TokenExpiredError, JsonWebTokenError } = require("jsonwebtoken");

dotenv.config();

const decodedJWT = (req, res) => {
    try {
        let receivedJWT = req.headers["authorization"]
        return jwt.verify(receivedJWT, process.env.PRIVATE_KEY);
    } catch (err) {
        console.error(err);

        if (err instanceof TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "message": "로그인 세션이 만료되었습니다. 다시 로그인해 주세요."
            })
        }

        if (err instanceof JsonWebTokenError) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                "message": "잘못된 토큰입니다."
            })
        }

        return err;
    }
}

const errorInsertSQL = async (results, queryName, res) => {
    if (results === 0 || !results) {
        console.error(`Error in ${queryName} query`);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

module.exports = { decodedJWT, errorInsertSQL };