const express = require("express");
const prisma = require("../db/prisma/client.prisma");

const commentsRouter = express.Router();

// 자유게시판 댓글 등록
commentsRouter.post("/articles/:articleId/comments", async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const content = req.body.content;

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    const comment = await prisma.articleComment.create({
      data: { content, articleId },
    });

    res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
});

// 중고마켓 댓글 등록
commentsRouter.post("/products/:productId/comments", async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const content = req.body.content;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    const comment = await prisma.productComment.create({
      data: { productId: productId, content },
    });

    res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
});

// 자유게시판 댓글 목록 조회 및 검색
commentsRouter.get("/comments/articles", async (req, res, next) => {
  try {
    const cursor = Number(req.query.cursor) || 0;
    const limit = Number(req.query.limit) || 10;

    const articleComment = await prisma.articleComment.findMany({
      skip: cursor,
      take: limit,
    });

    res.json(articleComment);
  } catch (e) {
    next(e);
  }
});

// 중고마켓 댓글 목록 조회 및 검색
commentsRouter.get("/comments/products", async (req, res, next) => {
  try {
    const cursor = Number(req.query.cursor) || 0;
    const limit = Number(req.query.limit) || 10;

    const productComment = await prisma.productComment.findMany({
      skip: cursor,
      take: limit,
    });

    res.json(productComment);
  } catch (e) {
    next(e);
  }
});

// 댓글 수정 - 일단 자유게시판만
commentsRouter.patch("/comments/:commentId", async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const content = req.body.content;

    if (!commentId) {
      return res.status(404).json({ message: "해당 게시글이 없습니다." });
    }

    const updateComment = await prisma.articleComment.update({
      where: { id: commentId },
      data: { content: content },
    });

    res.json(updateComment);
  } catch (e) {
    next(e);
  }
});

// 댓글 삭제 - 일단 자유게시판만22
commentsRouter.delete("/comments/:commentId", async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);

    await prisma.articleComment.delete({ where: { id: commentId } });

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

module.exports = commentsRouter;
