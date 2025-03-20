const express = require("express");
const articlesRouter = require("./articles.module");
const commentsRouter = require("./comments.module");

const router = express.Router();

router.use("/articles", articlesRouter);
router.use("/comments", commentsRouter);

module.exports = router;
