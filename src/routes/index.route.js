const express = require("express");
const articlesRouter = require("./article.route.js");

const indexRouter = express.Router();

indexRouter.use("/articles", articlesRouter);

module.exports = indexRouter;
