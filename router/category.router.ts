import express from "express";
import * as categoryController from "@controller/category.controller";

const router = express.Router();

router.use(express.json());

router.get("/", categoryController.allReadCategory);

export default router;
