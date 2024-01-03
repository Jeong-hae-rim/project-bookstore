const express = require("express");
const {
    allBooks,
    detailBook,
    categoryOfBooks
} = require("../controller/BookController");
const router = express.Router();

router.use(express.json);

router.get("/", allBooks);

router.get("/:id", detailBook);

router.get("/:category_id", categoryOfBooks);


module.exports = router;