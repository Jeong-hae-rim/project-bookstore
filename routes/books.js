const express = require("express");
const {
    allReadBooks,
    detailReadBook
} = require("../controller/bookController");
const router = express.Router();

router.use(express.json());

router.get("/", allReadBooks);
router.get("/:id", detailReadBook);

module.exports = router;