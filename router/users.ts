import express from "express";
const {
    userJoin,
    userLogin,
    requestPasswordReset,
    passwordReset,
} = require("../controller/userController");

const router = express.Router();

router.use(express.json());

router.post("/join", userJoin);
router.post("/login", userLogin);
router.post("/reset", requestPasswordReset);
router.put("/reset", passwordReset);

export default router;
