import express from "express";
import auth from "../middlewares/auth.js";
import commentService from "../services/commentService.js";

const commentController = express.Router();

/**
 * 댓글 생성
 */
commentController.post(
  "/article/:id",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const { content } = req.body;
      const authorId = req.user.userId;
      const articleId = Number(req.params.id);
      const comment = await commentService.create({
        content,
        authorId,
        articleId,
      });
      return res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * 상품 댓글 생성
 */
commentController.post(
  "/product/:id",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const { content } = req.body;
      const authorId = req.user.userId;
      const productId = Number(req.params.id);
      const comment = await commentService.create({
        content,
        authorId,
        productId,
      });
      return res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * 게시글 댓글 조회
 */
commentController.get("/article/:id", async (req, res, next) => {
  try {
    const comments = await commentService.getByArticleId(req.params.id);
    return res.json(comments);
  } catch (err) {
    next(err);
  }
});

/**
 * 상품 댓글 조회
 */
commentController.get("/product/:id", async (req, res, next) => {
  try {
    const comments = await commentService.getByProductId(req.params.id);
    return res.json(comments);
  } catch (err) {
    next(err);
  }
});

/**
 * 댓글 수정
 */
commentController.put(
  "/:id",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const updated = await commentService.update(
        req.params.id,
        req.body.content
      );
      return res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * 댓글 삭제
 */
commentController.delete(
  "/:id",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const deleted = await commentService.deleteById(req.params.id);
      return res.json(deleted);
    } catch (err) {
      next(err);
    }
  }
);

export default commentController;
