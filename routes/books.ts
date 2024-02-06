import express from "express";
const {
    allReadBooks,
    detailReadBook,
} = require("../controller/bookController");

const router = express.Router();

router.use(express.json());

router.get("/", allReadBooks);
router.get("/:id", detailReadBook);

export default router;
