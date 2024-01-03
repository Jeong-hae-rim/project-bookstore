const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");

const allBooks = (req, res) => {
    res.json({ message: "전체 도서 조회" })
}

const detailBook = (req, res) => {
    res.json({ message: "개별 도서 조회" })
}

const categoryOfBooks = (req, res) => {
    res.json({ message: "개별 카테고리 별 도서 조회" })
}

module.exports = {
    allBooks,
    detailBook,
    categoryOfBooks
}