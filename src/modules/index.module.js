const express = require("express");
const articlesRouter = require("./articles.module");
const commentRouter = require("./comments.module");

const router = express.Router();

router.use("/articles", articlesRouter);
router.use("/articles", commentRouter); 
module.exports = router;
