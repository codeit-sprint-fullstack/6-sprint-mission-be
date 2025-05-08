const express = require("express");
const articlesRouter = require("./articlesRouter");

const indexRouter = express.Router();

indexRouter.use("/articles", articlesRouter);

module.exports = indexRouter;
