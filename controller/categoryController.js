const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");

const allReadCategory = (req, res) => {
    res.json({ message: "카테고리 전체 조회" })
}

module.exports = allReadCategory;