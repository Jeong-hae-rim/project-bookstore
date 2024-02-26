import express from "express";

import * as bookController from "@controller/book.controller";
import {
    bookReadValidateRules,
    bookDetailValidationRules,
} from "@utils/validations";

const router = express.Router();

router.use(express.json());

router.get("/", bookReadValidateRules, bookController.getAllBook);
router.get("/:id", bookDetailValidationRules, bookController.getDetailBook);

export default router;
