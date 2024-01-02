const express = require("express");
const router = express.Router();

router.use(express.json);

router.put("/:id", (req, res) => {
    res.json({ message: "좋아요 추가" })
});

router.put("/:id", (req, res) => {
    res.json({ message: "좋아요 취소" })
});

module.exports = router;