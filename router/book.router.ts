import express from "express";

import * as bookController from "@controller/book.controller";
import { allValidateRules, detailValidationRules } from "@utils/validations";

const router = express.Router();

router.use(express.json());

router.get("/", allValidateRules, bookController.getAllBook);
router.get("/:id", detailValidationRules, bookController.getDetailBook);

export default router;
