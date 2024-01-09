const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");


const readAllOrder = (req, res) => {
    res.json({ message: "결제 상품 전체 조회" })
}

const addToOrder = (req, res) => {
    res.json({ message: "결제하기" })
}

const readDetailOrder = (req, res) => {
    res.json({ message: "결제 상품 상세 조회" })
}

module.exports = {
    readAllOrder,
    addToOrder,
    readDetailOrder
}