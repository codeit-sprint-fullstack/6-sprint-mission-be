const express = require("express");
const prisma = require("../db/prisma/client.prisma");

const marketCommentsRouter = express.Router();

/**
 * 댓글 등록
 */
marketCommentsRouter.post("/comments", async (req, res, next) => {
  try {
    const data = req.body;
    const { content } = data;

    if (!content) throw new Error("Enter the content");

    const comment = await prisma.marketComment.create({ data: { content } });

    res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
});

/**
 * 댓글 수정
 */
marketCommentsRouter.patch("/comments/:commentId", async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const data = req.body;
    const { content } = data;

    if (!isNaN(commentId)) throw new Error("commentId must be a number");

    await prisma.$transaction(async (tx) => {
      const comment = await tx.marketComment.update({
        where: { id: commentId },
        data: { content },
      });

      res.json(comment);
    });
  } catch (e) {
    next(e);
  }
});

/**
 * 댓글 삭제
 */
marketCommentsRouter.delete("/comments/:commentId", async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    await prisma.marketComment.delete({ where: { id: commentId } });
    if (!commentId) throw new Error("Comment Not Found");

    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

/**
 * 댓글 목록 조회
 */
marketCommentsRouter.get("/comments", async (req, res, next) => {
  try {
    const { cursor, limit } = req.query;
    const take = Number(limit) || 10;

    const comments = await prisma.marketComment.findMany({
      take: take,
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

module.exports = marketCommentsRouter;
