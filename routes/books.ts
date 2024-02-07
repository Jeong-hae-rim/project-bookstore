import express from "express";
import { ValidationChain, query } from "express-validator";

import * as bookController from "../controller/bookController";

// const {
//     allReadBooks,
//     detailReadBook,
// } = require("../controller/bookController");

const router = express.Router();

router.use(express.json());

export const validateRules: ValidationChain[] = [
    query("limit").isString().notEmpty(),
    query("currentPage").isString().notEmpty(),
    query("categoryId").isString().notEmpty(),
    // 다른 규칙도 추가할 수 있음
];

router.get("/", validateRules, bookController.getAllBook);
// router.get("/:id", detailReadBook);

export default router;
