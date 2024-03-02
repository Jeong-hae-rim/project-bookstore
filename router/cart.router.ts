import express from "express";
import {
    addCartValidationRules,
    cartValidationRules,
    removeCartValidationRules,
} from "@utils/validations";

import * as cartController from "@controller/cart.controller";

const router = express.Router();

router.use(express.json());

router.get("/", cartController.allReadCartItems);
router.post("/pick", cartValidationRules, cartController.pickCartItems);
router.post("/", addCartValidationRules, cartController.addToCarts);
router.delete("/:id", removeCartValidationRules, cartController.removeToCart);

export default router;
