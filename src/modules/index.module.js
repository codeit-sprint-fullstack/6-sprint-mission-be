const express = require("express");
const articlesrouter = require("./articles.module");
const productsRouter = require("./products.module");
const commentsRouter = require("./comments.module");

const router = express.Router();

router.use("/products", productsRouter);
router.use("/articles", articlesrouter);
router.use("/comments", commentsRouter);

module.exports = router;
