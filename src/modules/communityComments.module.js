const express = require("express");
const prisma = require("../db/prisma/client.prisma");

const communityCommentsRouter = express.Router();

/**
 * 댓글 등록
 */
communityCommentsRouter.post("/comments", async (req, res, next) => {
  try {
    const data = req.body;
    const { articleId, content } = data;

    if (!articleId || !content) throw new Error("Enter the title and content");

    const comment = await prisma.communityComment.create({
      data: { articleId, content },
    });

    res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
});

/**
 * 댓글 수정
 */
communityCommentsRouter.patch(
  "/comments/:commentId",
  async (req, res, next) => {
    try {
      const commentId = Number(req.params.commentId);
      const data = req.body;
      const { articleId, content } = data;

      if (isNaN(commentId)) throw new Error("commentId must be a nummber");

      await prisma.$transaction(async (tx) => {
        const comment = await tx.communityComment.update({
          where: { id: commentId },
          data: { articleId, content },
        });

        res.json(comment);
      });
    } catch (e) {
      next(e);
    }
  }
);

/**
 * 댓글 삭제
 */
communityCommentsRouter.delete(
  "/comments/:commentId",
  async (req, res, next) => {
    try {
      const commentId = Number(req.params.commentId);
      await prisma.communityComment.delete({ where: { id: commentId } });
      if (!commentId) throw new Error("Comment Not Found");

      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
);

/**
 * 댓글 목록 조회
 */
communityCommentsRouter.get("/comments", async (req, res, next) => {
  try {
    const { cursor, limit } = req.query;
    const take = Number(limit) || 10;

    const comments = await prisma.communityComment.findMany({
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

module.exports = communityCommentsRouter;
