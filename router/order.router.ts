import express from "express";

import * as orderController from "@controller/order.controller";

const router = express.Router();

router.use(express.json());

router.get("/", orderController.readAllOrder);
router.post("/", orderController.addToOrder);
router.get("/:id", orderController.readDetailOrder);

export default router;
