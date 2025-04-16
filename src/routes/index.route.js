const express = require("express");
const articlesRouter = require("./articles.route");
const commentsRouter = require("./comments.route");

const router = express.Router();

router.use("/articles", articlesRouter);
router.use("/comments", commentsRouter); // 댓글 수정 및 삭제 라우터 (생성 및 읽기는 articles에 넣음)

module.exports = router;
