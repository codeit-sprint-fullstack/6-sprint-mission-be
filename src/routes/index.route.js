const express = require("express");
const articlesRouter = require("./articles.route");
const commentsRouter = require("./comments.route");

const router = express.Router();

router.use("/articles", articlesRouter);
router.use("/comments", commentsRouter);

module.exports = router;
