import express from "express";
const allReadCategory = require("../controller/categoryController");

const router = express.Router();

router.use(express.json());

router.get("/", allReadCategory);

export default router;
