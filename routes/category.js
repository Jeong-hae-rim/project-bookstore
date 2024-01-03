const express = require("express");
const allReadCategory = require("../controller/categoryController");
const router = express.Router();

router.use(express.json());

router.get("/", allReadCategory);

module.exports = router;