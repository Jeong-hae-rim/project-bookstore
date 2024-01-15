const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const decodedJWT = (authorization) => {
    return jwt.decode(authorization, process.env.PRIVATE_KEY);
}

module.exports = { decodedJWT };