const express = require("express");
const {
    allReadBooks,
    detailReadBook
} = require("../controller/BookController");
const router = express.Router();

router.use(express.json());

router.get("/", allReadBooks);

router.get("/:id", detailReadBook);

module.exports = router;