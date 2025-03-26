const express = require("express");
const prisma = require("../db/prisma/client.prisma");

const commentsRouter = express.Router();

/**
 * 중고마켓 댓글 등록
 */
commentsRouter.post("/", async (req, res, next) => {
  try {
    const { content } = req.body;

    const comments = await prisma.productComment.create({
      data: { content },
    });

    res.json(comments);
  } catch (e) {
    next(e);
  }
});

/**
 * 자유게시판 댓글 등록
 */
commentsRouter.post("/", async (req, res, next) => {
  try {
    const { content } = req.body;

    const comments = await prisma.articleComment.create({
      data: { content },
    });

    res.json(comments);
  } catch (e) {
    next(e);
  }
});

/**
 * 중고마켓 댓글 수정
 */
commentsRouter.patch("/", async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const { content } = req.body;

    await prisma.productComment.update({
      where: { id: commentId },
      data: { content },
    });
  } catch (e) {
    next(e);
  }
});

/**
 * 자유게시판 댓글 수정
 */
commentsRouter.patch("/", async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const { content } = req.body;

    await prisma.articleComment.update({
      where: { id: commentId },
      data: { content },
    });
  } catch (e) {
    next(e);
  }
});

/**
 * 중고마켓 댓글 삭제
 */
commentsRouter.delete("/:commentId", async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);

    await prisma.productComment.delete({ where: { id: commentId } });
  } catch (e) {
    next(e);
  }
});

/**
 * 자유게시판 댓글 삭제
 */
commentsRouter.delete("/:commentId", async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);

    await prisma.articleComment.delete({ where: { id: commentId } });
  } catch (e) {
    next(e);
  }
});

/**
 * 중고마켓 댓글 목록 조회
 */
commentsRouter.get("/", async (req, res, next) => {
  try {
    const lastId = Number(req.query.cursor);

    const comments = await prisma.productComment.findMany({
      skip: lastId ? lastId : 0,
    });

    res.json(comments);
  } catch (e) {
    next(e);
  }
});

/**
 * 자유게시판 댓글 목록 조회
 */
commentsRouter.get("/", async (req, res, next) => {
  try {
    const lastId = Number(req.query.cursor);

    const comments = await prisma.articleComment.findMany({
      skip: lastId ? lastId : 0,
    });

    res.json(comments);
  } catch (e) {
    next(e);
  }
});

module.exports = commentsRouter;
