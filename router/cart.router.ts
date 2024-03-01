import express from "express";
import * as cartController from "@controller/cart.controller";
import { cartValidationRules } from "@utils/validations";

const router = express.Router();

router.use(express.json());

router.get("/", cartValidationRules, cartController.allReadCartItems);
// router.post("/", addToCarts);
// router.delete("/:id", removeToCarts);

export default router;
