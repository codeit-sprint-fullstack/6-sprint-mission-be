const express = require("express");
const productsRouter = require("./products.module");
const articleRouter = require("./articles.module");
const articleCommentsRouter = require("./commentsArticle.module");
const productCommentsRouter = require("./commentsProduct.module");

const router = express.Router();

router.use("/products", productsRouter);
router.use("/product", productCommentsRouter);

router.use("/articles", articleRouter);
router.use("/", articleCommentsRouter);

module.exports = router;
