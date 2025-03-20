const express = require("express");
const articlesRouter = require("./articles.module");
const router = express.Router();
router.use("/articles", articlesRouter);
//여기썼음

module.exports = router;
