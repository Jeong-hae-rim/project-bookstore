import express from "express";
import * as cartController from "@controller/cart.controller";
import {
    addCartValidationRules,
    cartValidationRules,
} from "@utils/validations";

const router = express.Router();

router.use(express.json());

router.get("/", cartValidationRules, cartController.allReadCartItems);
router.post("/", addCartValidationRules, cartController.addToCarts);
// router.delete("/:id", removeToCarts);

export default router;
