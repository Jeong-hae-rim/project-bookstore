const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");

const allReadCartItems = (req, res) => {
    res.json({ message: "장바구니 조회" })
}

const addToCarts = (req, res) => {
    res.json({ message: "장바구니 담기" })
}

const removeToCarts = (req, res) => {
    res.json({ message: "장바구니 도서 삭제" })
}

module.exports = {
    allReadCartItems,
    addToCarts,
    removeToCarts
}