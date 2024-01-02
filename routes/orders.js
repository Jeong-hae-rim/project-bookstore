const express = require("express");
const router = express.Router();

router.use(express.json);

router.get("/", (req, res) => {
    res.json({ message: "결제 상품 전체 조회" })
});

router.post("/", (req, res) => {
    res.json({ message: "결제하기" })
});

router.get("/:id", (req, res) => {
    res.json({ message: "결제 상품 상세 조회" })
});


module.exports = router;