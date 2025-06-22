import express, { NextFunction, Request, Response } from "express";
import auth from "../middlewares/auth";
import commentService from "../services/commentService";
import { Comment, Product } from "@prisma/client";
import { ValidationError } from "../types/errors";

const commentController = express.Router();

/**
 * 게시글 댓글 생성
 */
commentController.post(
  "/article/:articleId",
  auth.verifyAccessToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authorId = (req as any).auth?.id;
      if (!authorId) {
        res.status(401).json({ message: "로그인이 필요합니다." });
        return;
      }

      const articleId = parseInt(req.params.articleId);
      if (isNaN(articleId)) {
        const error = new ValidationError("유효하지 않은 게시글 ID입니다.");
        throw error;
      }

      const { content } = req.body;
      if (!content) {
        const error = new ValidationError("댓글 내용은 필수입니다.");
        throw error;
      }

      const comment = await commentService.create({
        content,
        authorId,
        articleId,
        productId: null,
      });

      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * 상품 댓글 생성
 */
commentController.post(
  "/product/:productId",
  auth.verifyAccessToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authorId = (req as any).auth?.id;
      if (!authorId) {
        res.status(401).json({ message: "로그인이 필요합니다." });
        return;
      }

      const productId = parseInt(req.params.productId);
      if (isNaN(productId)) {
        const error = new ValidationError("유효하지 않은 상품 ID입니다.");
        throw error;
      }

      const { content } = req.body;
      if (!content) {
        const error = new ValidationError("댓글 내용은 필수입니다.");
        throw error;
      }

      const comment = await commentService.create({
        content,
        authorId,
        articleId: null,
        productId,
      });

      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * 게시글 댓글 조회
 */
commentController.get(
  "/article/:articleId",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const articleId = parseInt(req.params.articleId);
      if (isNaN(articleId)) {
        const error = new ValidationError("유효하지 않은 게시글 ID입니다.");
        throw error;
      }

      const comments = await commentService.getByArticleId(articleId);
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * 상품 댓글 조회
 */
commentController.get(
  "/product/:productId",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = parseInt(req.params.productId);
      if (isNaN(productId)) {
        const error = new ValidationError("유효하지 않은 상품 ID입니다.");
        throw error;
      }

      const comments = await commentService.getByProductId(productId);
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * 댓글 수정
 */
commentController.put(
  "/:id",
  auth.verifyAccessToken,
  auth.checkCommentOwner,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const error = new ValidationError("유효하지 않은 댓글 ID입니다.");
        throw error;
      }

      const { content } = req.body;
      if (!content) {
        const error = new ValidationError("댓글 내용은 필수입니다.");
        throw error;
      }

      const comment = await commentService.update(id, content);
      res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * 댓글 삭제
 */
commentController.delete(
  "/:id",
  auth.verifyAccessToken,
  auth.checkCommentOwner,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const error = new ValidationError("유효하지 않은 댓글 ID입니다.");
        throw error;
      }

      await commentService.deleteById(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default commentController;
