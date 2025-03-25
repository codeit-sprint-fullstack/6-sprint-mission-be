const express = require("express");
const prisma = require("../db/prisma/client.prisma");
const errorHandler = require("../middleware/errorHandle.middleware");

const articleCommentsRouter = express.Router();

articleCommentsRouter.post(
  "/:articleId",
  errorHandler,
  async (req, res, next) => {
    try {
      const articleId = req.params.articleId;
      const data = req.body;
      const { content } = data;
      const comment = await prisma.comment.create({
        data: { content, articleId },
      });
      res.status(201).json(comment);
    } catch (e) {
      next(e);
    }
  }
);

// 댓글 목록 조회
articleCommentsRouter.get(
  "/:articleId",
  errorHandler,
  async (req, res, next) => {
    try {
      const articleId = req.params.articleId;
      const { cursor, limit = 10 } = req.query;
      const comments = await prisma.comment.findMany({
        where: { articleId },
        take: Number(limit),
        skip: cursor ? 1 : 0,
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      });
      if (!comments) throw new Error("No comment found");

      const nextCursor = comments[comments.length - 1].id;
      res.json({ comments, nextCursor });
    } catch (e) {
      next(e);
    }
  }
);

module.exports = articleCommentsRouter;
