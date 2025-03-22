const express = require("express");
const itemsRouter = require("./item.module");
const articlesRouter = require("./articles.module");
const commentsRouter = require("./comments.module");

const router = express.Router();

router.use("/items", itemsRouter);
router.use("/articles", articlesRouter);
router.use("/comments", commentsRouter);

module.exports = router;
