import express from "express";
const {
    readAllOrder,
    addToOrder,
    readDetailOrder,
} = require("../controller/orderController");

const router = express.Router();

router.use(express.json());

router.get("/", readAllOrder);
router.post("/", addToOrder);
router.get("/:id", readDetailOrder);

export default router;
