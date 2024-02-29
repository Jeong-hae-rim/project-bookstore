import express from "express";
import { addLike } from "@controller/like.controller";
import { addLikeValidateRules } from "@utils/validations";

const router = express.Router();

router.use(express.json());

router.post("/:id", addLikeValidateRules, addLike);
// router.delete("/:id", removeLike);

export default router;
