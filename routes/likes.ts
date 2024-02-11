import express from "express";
const { addLike, removeLike } = require("../controller/likeController");

const router = express.Router();

router.use(express.json());

router.post("/:id", addLike);
router.delete("/:id", removeLike);

export default router;
