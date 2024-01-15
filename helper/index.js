const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const decodedJWT = (req) => {
    try {
        let receivedJWT = req.headers["authorization"]
        return jwt.verify(receivedJWT, process.env.PRIVATE_KEY);
    } catch (err) {
        console.error(err);
        return err;
    }
}

module.exports = { decodedJWT };