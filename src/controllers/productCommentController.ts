import express, { NextFunction, Request, Response } from "express";
import productCommentService from "../services/productCommentService";
import auth from "../middlewares/auth";
import { AuthenticationError, ValidationError } from "@/types/errors";

const productCommentController = express.Router();

interface AuthenticatedRequest extends Request {
  auth?: {
    userId: number;
  };
}

// 상품 댓글 조회 api
productCommentController.get(
  "/products/:id/comments",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.id);
      const limit = parseInt(req.query.limit as string) || 5;
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
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.id);
      const userId = req.auth?.userId;
      const { content } = req.body;

      if (!userId) {
        throw new AuthenticationError("인증 정보가 없습니다.");
      }

      if (!content || content.trim() === "") {
        throw new ValidationError("댓글 내용을 입력해주세요.");
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
