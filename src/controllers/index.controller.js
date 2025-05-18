const express = require("express");

const authController = require("./auth.controller.js");
const articlesController = require("./articles.controller.js");
const productsController = require("./products.controller.js");
const commentsRouter = require("./comments.controller.js");

const router = express.Router();

router.use("/auth", authController);
router.use("/articles", articlesController);
router.use("/products", productsController);
// router.use("/comments", commentsRouter);

module.exports = router;
