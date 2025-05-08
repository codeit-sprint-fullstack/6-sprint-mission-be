const express = require("express");
const articlesRouter = require("./articlesModule");

const indexRouter = express.Router();

indexRouter.use("/articles", articlesRouter);

module.exports = indexRouter;
