import express from "express";
import {
    addCartValidationRules,
    cartValidationRules,
    removeCartValidationRules,
} from "@utils/validations";

import * as cartController from "@controller/cart.controller";

const router = express.Router();

router.use(express.json());

router.get("/", cartValidationRules, cartController.allReadCartItems);
router.post("/", addCartValidationRules, cartController.addToCarts);
router.delete("/", removeCartValidationRules, cartController.removeToCart);

export default router;
