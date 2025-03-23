const express = require("express");
const prisma = require("../db/prisma/client.prisma");

const commentRouter = express.Router();

/**
 * 댓글 등록
 */
commentRouter.post("/:articleId/comments", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const { content } = req.body;

    if (!articleId) throw new Error("게시글이 없습니다.");

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId,
      },
    });

    res.json(comment);
  } catch (e) {
    next(e);
  }
});

/**
 * 댓글 목록 조회
 */
commentRouter.get("/:articleId/comments", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    if (!articleId) throw new Error("게시글이 없습니다.");

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    const comments = await prisma.comment.findMany({
      where: { articleId },
    });

    res.json(comments);
  } catch (e) {
    next(e);
  }
});

/**
 * 댓글 수정하기
 */

commentRouter.patch("/:commentId", async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment) {
      return res.json({ error: "댓글을 찾을 수 없습니다." });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: Number(commentId) },
      data: { content },
    });

    res.json(updatedComment);
  } catch (e) {
    next(e);
  }
});

/**
 * 댓글 삭제
 */
commentRouter.delete("/:commentId", async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });
    if (!comment) {
      return res.status(404).json({ error: "삭제할 글이 없습니다." });
    }
    await prisma.comment.delete({
      where: { id: Number(commentId) },
    });
    res.send();
  } catch (e) {
    next(e);
  }
});

module.exports = commentRouter;
