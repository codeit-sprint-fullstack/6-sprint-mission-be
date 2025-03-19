const express = require("express");
const productsRouter = require("./products.module");
const articleRouter = require("./articles.module");
const commentsRouter = require("./comments.module");

const router = express.Router();

router.use("/products", productsRouter);
router.use("/articles", articleRouter);
router.use("/comments", commentsRouter);

module.exports = router;
