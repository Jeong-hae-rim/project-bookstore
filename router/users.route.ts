import express from "express";
import * as userController from "@controller/user.controller";
import {
    passwordRequestValidateRules,
    passwordResetValidateRules,
    userJoinValidateRules,
} from "@utils/validations";

const router = express.Router();

router.use(express.json());

router.post("/join", userJoinValidateRules, userController.userJoin);
// router.post("/login", userController.userLogin);
router.post(
    "/reset",
    passwordRequestValidateRules,
    userController.requestPasswordReset,
);
router.put("/reset", passwordResetValidateRules, userController.passwordReset);

export default router;
