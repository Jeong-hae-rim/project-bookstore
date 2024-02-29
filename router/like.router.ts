import express from "express";

import * as likeController from "@controller/like.controller";
import { likeValidateRules } from "@utils/validations";

const router = express.Router();

router.use(express.json());

router.post("/:id", likeValidateRules, likeController.addLike);
router.delete("/:id", likeValidateRules, likeController.removeLike);

export default router;
