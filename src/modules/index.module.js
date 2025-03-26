const express = require("express");
const articlesRouter = require("./articles.module");
const marketCommentsRouter = require("./marketComments.module");
const communityCommentsRouter = require("./communityComments.module");

const router = express.Router();

router.use("/articles", articlesRouter);
router.use("/market", marketCommentsRouter);
router.use("/community", communityCommentsRouter);

module.exports = router;
