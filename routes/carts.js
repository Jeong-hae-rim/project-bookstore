const express = require("express");
const {
    allReadCartItems,
    addToCarts,
    removeToCarts,
} = require("../controller/cartController");
const router = express.Router();


router.use(express.json());

router.get("/", allReadCartItems);

router.post("/", addToCarts);

router.delete("/:id", removeToCarts);

module.exports = router;