/********************************
 * 게시글 관련 댓글 코드입니다
 ********************************/
const express = require("express");
const prisma = require("../db/prisma/client.prisma");

const articleCommentsRouter = express.Router();

/**
 * 댓글 등록
 */
articleCommentsRouter.post("/:articleId/comment", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const { content } = req.body;

    if (!articleId) throw new Error("존재하지 않는 게시글입니다");

    const comment = await prisma.articleComment.create({
      data: { content, articleId },
    });

    res.json(comment);
  } catch (e) {
    next(e);
  }
});

/**
 * 댓글 목록 조회
 */
articleCommentsRouter.get("/:articleId/comments", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    if (!articleId) throw new Error("존재하지 않는 게시글입니다.");

    const comments = await prisma.articleComment.findMany({
      where: { articleId },
    });
    if (comments.length === 0)
      return res.json("해당 게시글엔 댓글이 없습니다.");

    res.json(comments);
  } catch (e) {
    next(e);
  }
});

/**
 * 댓글 수정
 */
articleCommentsRouter.patch("/comment/:commentId", async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);

    const existingComment = await prisma.articleComment.findUnique({
      where: { id: commentId },
    });
    if (!existingComment) return res.json("존재하지 않는 댓글입니다...");

    const { content } = req.body;

    const comment = await prisma.articleComment.update({
      where: { id: commentId },
      data: { content },
    });

    res.json(comment);
  } catch (e) {
    next(e);
  }
});

/**
 * 댓글 삭제
 */
articleCommentsRouter.delete("/comment/:commentId", async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);

    const existingComment = await prisma.articleComment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment)
      return res.status(404).json("존재하지 않는 댓글은 삭제할 수 없습니다..");

    await prisma.articleComment.delete({ where: { id: commentId } });

    res.status(200).json("댓글이 삭제되었습니다.");
  } catch (e) {
    next(e);
  }
});

module.exports = articleCommentsRouter;
