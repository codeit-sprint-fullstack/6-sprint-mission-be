import express from "express";
import prisma from "../db/prisma/client.prisma.js";

const commentRouter = express.Router();

const ARTICLE_COMMENT = "/articles/:articleId/comments";
const PRODUCT_COMMENT = "/products/:productId/comments";

// 게시글 댓글 불러오기
commentRouter.get(`${ARTICLE_COMMENT}`, async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const { limit, cursor } = req.query;

    await prisma.$transaction(async (tx) => {
      const articleCommentId = cursor
        ? await tx.articleComment.findFirst({
            where: { articleId, id: Number(cursor) },
          })
        : false;

      const articleComment = await tx.articleComment.findMany({
        where: { articleId },
        skip: articleCommentId ? 1 : undefined,
        take: Number(limit) || 10,
        cursor: articleCommentId ? { id: Number(cursor) } : undefined,
        omit: { articleId: true },
      });

      res.json(articleComment);
    });
  } catch (e) {
    next(e);
  }
});

// 게시글 댓글 작성
commentRouter.post(`${ARTICLE_COMMENT}`, async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);

    const { content } = req.body;

    const newArticleComment = await prisma.articleComment.create({
      data: { content, articleId },
    });

    res.status(201).json(newArticleComment);
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

    await prisma.$transaction(async (tx) => {
      const articleComment = await tx.articleComment.findUnique({
        where: { articleId, id: commentId },
      });
      if (!articleComment) throw new Error("존재하지 않는 댓글입니다.");

      const updateArticleComment = await tx.articleComment.update({
        where: { articleId, id: commentId },
        data: { content },
      });

      res.status(200).json(updateArticleComment);
    });
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
    try {
      await prisma.$transaction(async (tx) => {
        const articleComment = await tx.articleComment.findUnique({
          where: { articleId, id: commentId },
        });
        if (!articleComment) {
          throw new Error("이미 삭제된 댓글입니다.");
        }

        await tx.articleComment.delete({
          where: { articleId, id: commentId },
        });

        res.sendStatus(204);
      });
    } catch (e) {
      next(e);
    }
  }
);

// 상품 댓글 불러오기
commentRouter.get(`${PRODUCT_COMMENT}`, async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    const { limit, cursor } = req.query;

    await prisma.$transaction(async (tx) => {
      const productCommentId = cursor
        ? await tx.productComment.findFirst({
            where: { productId, id: Number(cursor) },
          })
        : false;

      const productComment = await tx.productComment.findMany({
        where: { productId },
        skip: productCommentId ? 1 : undefined,
        take: Number(limit) || 10,
        cursor: productCommentId ? { id: Number(cursor) } : undefined,
        omit: { productId: true },
      });

      res.json(productComment);
    });
  } catch (e) {
    next(e);
  }
});

// 상품 댓글 작성
commentRouter.post(`${PRODUCT_COMMENT}`, async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);

    const { content } = req.body;

    const newProductComment = await prisma.productComment.create({
      data: { content, productId },
    });

    res.status(201).json(newProductComment);
  } catch (e) {
    next(e);
  }
});

// 상품 댓글 수정
commentRouter.patch(`${PRODUCT_COMMENT}/:commentId`, async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    const commentId = Number(req.params.commentId);
    const { content } = req.body;

    await prisma.$transaction(async (tx) => {
      const productComment = await tx.productComment.findUnique({
        where: { productId, id: commentId },
      });
      if (!productComment) throw new Error("존재하지 않는 댓글입니다.");

      const updateProductComment = await tx.productComment.update({
        where: { productId, id: commentId },
        data: { content },
      });

      res.status(200).json(updateProductComment);
    });
  } catch (e) {
    next(e);
  }
});

// 상품 댓글 삭제
commentRouter.delete(
  `${PRODUCT_COMMENT}/:commentId`,
  async (req, res, next) => {
    const productId = Number(req.params.productId);
    const commentId = Number(req.params.commentId);
    try {
      await prisma.$transaction(async (tx) => {
        const productComment = await tx.productComment.findUnique({
          where: { productId, id: commentId },
        });
        if (!productComment) {
          throw new Error("이미 삭제된 댓글입니다.");
        }

        await tx.productComment.delete({
          where: { productId, id: commentId },
        });

        res.sendStatus(204);
      });
    } catch (e) {
      next(e);
    }
  }
);

export default commentRouter;
