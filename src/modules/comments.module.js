const express = require("express");
const prisma = require("../db/prisma/client");

const commentsRouter = express.Router();

/**
 * 댓글 등록 (중고마켓)
 */
commentsRouter.post("/market/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const { content } = req.body;

    if (isNaN(articleId)) throw new Error("Comment must be a number");

    const comment = await prisma.comment.create({
      data: { content, articleId, boardType: "market" },
    });

    res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
});

/**
 * 댓글 등록 (자유게시판)
 */
commentsRouter.post("/freeboard/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const { content } = req.body;

    if (isNaN(articleId)) throw new Error("Comment must be a number");

    const comment = await prisma.comment.create({
      data: { content, articleId, boardType: "freeboard" },
    });

    res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
});

/**
 * 댓글 수정 (중고마켓, 자유게시판 공통)
 */
commentsRouter.patch(
  "/:boardType/:articleId/:commentId",
  async (req, res, next) => {
    try {
      const { boardType, articleId, commentId } = req.params;
      const { content } = req.body;

      const comment = await prisma.comment.findUnique({
        where: {
          id: Number(commentId),
        },
      });

      if (
        !comment ||
        comment.articleId !== Number(articleId) ||
        comment.boardType !== boardType
      )
        throw new Error("Not found a Comment");

      const updatedComment = await prisma.comment.update({
        where: {
          id: Number(commentId),
        },
        data: { content },
      });

      res.status(200).json(updatedComment);
    } catch (e) {
      next(e);
    }
  }
);

/**
 * 댓글 삭제 (중고마켓, 자유게시판 공통)
 */
commentsRouter.delete(
  "/:boardType/:articleId/:commentId",
  async (req, res, next) => {
    try {
      const { boardType, articleId, commentId } = req.params;

      const comment = await prisma.comment.delete({
        where: { id: Number(commentId) },
      });

      if (
        !comment ||
        comment.articleId !== Number(articleId) ||
        comment.boardType !== boardType
      )
        throw new Error("Comment not found");

      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (e) {
      next(e);
    }
  }
);

/**
 * 댓글 목록 조회 (중고마켓) - Cursor 기반 페이지네이션 적용
 */
commentsRouter.get("/market/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const take = Number(req.query.take) || 10; // 기본 10개 가져오기
    const cursor = req.query.cursor ? Number(req.query.cursor) : null;

    if (isNaN(articleId)) throw new Error("Article ID must be a number");

    const queryOptions = {
      where: { articleId, boardType: "market" },
      select: { id: true, content: true, createdAt: true },
      orderBy: { id: "desc" },
      take: take,
    };

    if (cursor) {
      queryOptions.skip = 1; // cursor 값을 제외하고 가져옴
      queryOptions.cursor = { id: cursor };
    }

    const comments = await prisma.comment.findMany(queryOptions);
    const nextCursor = comments.length === take ? comments[take - 1].id : null;

    res.status(200).json({ comments, nextCursor });
  } catch (e) {
    next(e);
  }
});


/**
 * 댓글 목록 조회 (자유게시판) - Cursor 기반 페이지네이션 적용
 */
commentsRouter.get("/freeboard/:articleId", async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const take = Number(req.query.take) || 10;
    const cursor = req.query.cursor ? Number(req.query.cursor) : null;

    if (isNaN(articleId)) throw new Error("Article ID must be a number");

    const queryOptions = {
      where: { articleId, boardType: "freeboard" },
      select: { id: true, content: true, createdAt: true },
      orderBy: { id: "desc" },
      take: take,
    };

    if (cursor) {
      queryOptions.skip = 1;
      queryOptions.cursor = { id: cursor };
    }

    const comments = await prisma.comment.findMany(queryOptions);
    const nextCursor = comments.length === take ? comments[take - 1].id : null;

    res.status(200).json({ comments, nextCursor });
  } catch (e) {
    next(e);
  }
});

module.exports = commentsRouter;
