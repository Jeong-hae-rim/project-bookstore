const express = require("express");
const router = express.Router();

router.use(express.json);

router.get("/", (req, res) => {
    res.json({ message: "전체 도서 조회" })
});

router.get("/:id", (req, res) => {
    res.json({ message: "개별 도서 조회" })
});

router.get("/:category_id", (req, res) => {
    res.json({ message: "개별 카테고리 조회" })
});

router.get("/", (req, res) => {
    res.json({ message: "비밀 번호 초기화" })
});

module.exports = router;