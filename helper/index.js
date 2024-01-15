const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { StatusCodes } = require("http-status-codes");

dotenv.config();

const decodedJWT = (req, res) => {
    try {
        let receivedJWT = req.headers["authorization"]
        return jwt.verify(receivedJWT, process.env.PRIVATE_KEY);
    } catch (err) {
        console.error(err);

        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "로그인 세션이 만료되었습니다."
        });
    }
}

module.exports = { decodedJWT };