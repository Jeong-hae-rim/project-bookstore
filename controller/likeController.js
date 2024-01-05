const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");

const addLike = (req, res) => {
    res.json({ message: "좋아요 추가" })
};

const removeLike = (req, res) => {
    res.json({ message: "좋아요 취소" })
};

module.exports = { addLike, removeLike }