import express from "express";
import productCommentService from "../services/productCommentService.js";
import auth from "../middlewares/auth.js";

const productCommentController = express.Router();

// 상품 댓글 조회 api
productCommentController.get(
  "/products/:id/comments",
  async (req, res, next) => {
    try {
      const productId = Number(req.params.id);
      const limit = parseInt(req.query.limit) || 5;
      const cursor = req.query.cursor ? Number(req.query.cursor) : null;

      const result = await productCommentService.getProductComments(productId, {
        limit,
        cursor,
      });

      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// 댓글 등록 api
productCommentController.post(
  "/products/:id/comments",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const productId = Number(req.params.id);
      const userId = req.auth.userId;
      const { content } = req.body;

      if (!content || content.trim() === "") {
        return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
      }

      const newComment = await productCommentService.createProductComment(
        productId,
        userId,
        content
      );

      res.status(201).json(newComment);
    } catch (err) {
      next(err);
    }
  }
);

export default productCommentController;
