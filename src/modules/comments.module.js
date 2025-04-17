const express = require("express");
const prisma = require("../db/prisma/client.prisma");

// 중첩 라우터 설정
const commentsRouter = express.Router({ mergeParams: true });

/**
 * 댓글 등록
 */
commentsRouter.post("/", async (req, res, next) => {
  try {
    const { content } = req.body;
    const articleId = req.params.articleId
      ? Number(req.params.articleId)
      : null;
    const productId = req.params.productId
      ? Number(req.params.productId)
      : null;

    if ((!articleId && !productId) || !content)
      throw new Error("댓글 내용을 입력해주세요.");

    const comment = await prisma.comment.create({
      data: {
        ...(articleId && { articleId }),
        ...(productId && { productId }),
        content,
      },
    });

    res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
});

/**
 * 댓글 수정
 */
commentsRouter.patch("/:commentId", async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const { content } = req.body;

    if (isNaN(commentId)) throw new Error("댓글 Id는 숫자여야 합니다.");

    const comment = await prisma.comment.update({
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
commentsRouter.delete("/:commentId", async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    if (!commentId) throw new Error("댓글을 찾을 수 없습니다.");

    await prisma.comment.delete({ where: { id: commentId } });

    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

/**
 * 댓글 목록 조회
 */
commentsRouter.get("/", async (req, res, next) => {
  try {
    const articleId = req.params.articleId
      ? Number(req.params.articleId)
      : null;
    const productId = req.params.productId
      ? Number(req.params.productId)
      : null;
    const { cursor, limit } = req.query;
    const take = Number(limit) || 10;

    const where = articleId ? { articleId } : productId ? { productId } : {};

    const comments = await prisma.comment.findMany({
      where,
      take,
      ...(cursor && {
        skip: 1,
        cursor: {
          id: Number(cursor),
        },
      }),
      orderBy: { createdAt: "desc" },
    });

    res.json(comments);
  } catch (e) {
    next(e);
  }
});

module.exports = commentsRouter;
