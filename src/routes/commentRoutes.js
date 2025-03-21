import express from "express";
import prisma from "../db/prisma/client.prisma.js";

const commentRouter = express.Router();

const ARTICLE_COMMENT = "/articles/:articleId/comments";
const PRODUCT_COMMENT = "/products/:productId/comments";

// 게시글 댓글 불러오기
commentRouter.get(`${ARTICLE_COMMENT}`, async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const commentId = await prisma.articleComment.findFirst({
      where: { articleId },
      select: { id: true },
    });

    const comment = await prisma.articleComment.findMany({
      where: { articleId },
      cursor: commentId,
      omit: { articleId: true },
    });

    res.json(comment);
  } catch (e) {
    next(e);
  }
});

// 게시글 댓글 작성
commentRouter.post(`${ARTICLE_COMMENT}`, async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);

    const { content } = req.body;

    const articleComment = await prisma.articleComment.create({
      data: { content, articleId },
    });

    res.status(201).json(articleComment);
  } catch (e) {
    next(e);
  }
});

// 게시글 댓글 수정
commentRouter.patch(`${ARTICLE_COMMENT}/:commentId`, async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const commentId = Number(req.params.commentId);
    const { content } = req.body;

    const updateArticleComment = await prisma.articleComment.update({
      where: { articleId, id: commentId },
      data: { content },
    });

    res.status(200).json(updateArticleComment);
  } catch (e) {
    next(e);
  }
});

// 게시글 댓글 삭제
commentRouter.delete(
  `${ARTICLE_COMMENT}/:commentId`,
  async (req, res, next) => {
    const articleId = Number(req.params.articleId);
    const commentId = Number(req.params.commentId);

    await prisma.articleComment.delete({
      where: { articleId, id: commentId },
    });

    res.sendStatus(204);
    try {
    } catch (e) {
      next(e);
    }
  }
);

// 상품 댓글 불러오기

// 상품 댓글 작성
commentRouter.post(`${PRODUCT_COMMENT}`, async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);

    const { content } = req.body;

    const productComment = await prisma.productComment.create({
      data: { content, productId },
    });

    res.status(201).json(productComment);
  } catch (e) {
    next(e);
  }
});

export default commentRouter;
