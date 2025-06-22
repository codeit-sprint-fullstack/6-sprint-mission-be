import { Request, Response, NextFunction } from "express";
import commentService from "../services/comment.service";
import { AuthRequest } from "../Types/user";

const commentController = {
  createComment: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { content } = req.body;
      const { userId } = req.auth!;
      const { itemType, itemId } = req.params;
      let articleId: string | null = null;
      let productId: string | null = null;

      if (itemType === "articles") {
        articleId = itemId;
      } else if (itemType === "products") {
        productId = itemId;
      } else {
        return res.status(400).json({ message: "잘못된 itemType입니다." });
      }

      const newComment = await commentService.createComment(
        userId,
        content,
        articleId ? parseInt(articleId) : null,
        productId ? parseInt(productId) : null
      );
      return res.status(201).json(newComment);
    } catch (error) {
      next(error);
      return;
    }
  },

  getCommentsByArticleId: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { articleId } = req.params;
      const comments = await commentService.getCommentsByArticleId(
        parseInt(articleId)
      );
      return res.status(200).json(comments);
    } catch (error) {
      next(error);
      return;
    }
  },

  getCommentsByProductId: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { productId } = req.params;
      const comments = await commentService.getCommentsByProductId(
        parseInt(productId)
      );
      return res.status(200).json(comments);
    } catch (error) {
      next(error);
      return;
    }
  },

  updateComment: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      const { userId } = req.auth!;
      const updatedComment = await commentService.updateComment(
        parseInt(commentId),
        userId,
        content
      );
      return res.status(200).json(updatedComment);
    } catch (error) {
      next(error);
      return;
    }
  },

  deleteComment: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { commentId } = req.params;
      const { userId } = req.auth!;
      await commentService.deleteComment(parseInt(commentId), userId);
      return res.status(204).send();
    } catch (error) {
      next(error);
      return;
    }
  },
};

export default commentController;
