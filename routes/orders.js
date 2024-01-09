const express = require("express");
const {
    readAllOrder,
    addToOrder,
    readDetailOrder
} = require("../controller/orderController");
const router = express.Router();

router.use(express.json());

router.get("/", readAllOrder);

router.post("/", addToOrder);

router.get("/:id", readDetailOrder);


module.exports = router;