const express = require("express");
const router = express.Router();
const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");
const { userJoin } = require("../controller/userController");

router.use(express.json());

router.post("/join", userJoin);

router.post("/login", (req, res) => {
    res.json({ message: "로그인" })
});

router.post("/reset", (req, res) => {
    res.json({ message: "비밀 번호 초기화 요청" })
});

router.put("/reset", (req, res) => {
    res.json({ message: "비밀 번호 초기화" })
});

module.exports = router;