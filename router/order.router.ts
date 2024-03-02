import express from "express";

import * as orderController from "@controller/order.controller";
import { orderDetailValidateRules } from "@utils/validations";

const router = express.Router();

router.use(express.json());

router.get("/", orderController.readAllOrder);
router.post("/", orderController.addToOrder);
router.get("/:id", orderDetailValidateRules, orderController.readDetailOrder);

export default router;
