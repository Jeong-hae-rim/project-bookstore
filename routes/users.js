const express = require("express");
const router = express.Router();
const {
    userJoin,
    userLogin,
    requestPasswordReset,
    passwordReset
} = require("../controller/userController");

router.use(express.json());

router.post("/join", userJoin);
router.post("/login", userLogin);
router.post("/reset", requestPasswordReset);
router.put("/reset", passwordReset);

module.exports = router;