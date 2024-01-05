const express = require("express");
const { addLike, removeLike } = require("../controller/likeController");
const router = express.Router();

router.use(express.json);

router.put("/:id", addLike);

router.put("/:id", removeLike);

module.exports = router;