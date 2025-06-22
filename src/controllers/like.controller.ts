import { Request, Response, NextFunction } from "express";
import likeService from "../services/like.service";
import { AuthRequest } from "../Types/user";

const likeController = {
  addLike: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { itemType, itemId } = req.params;
      const { userId } = req.auth!;
      let articleId: string | null = null;
      let productId: string | null = null;

      if (itemType === "articles") {
        articleId = itemId;
      } else if (itemType === "products") {
        productId = itemId;
      } else {
        return res.status(400).json({ message: "잘못된 itemType입니다." });
      }

      await likeService.addLike(
        userId,
        articleId ? parseInt(articleId) : null,
        productId ? parseInt(productId) : null
      );
      return res.status(201).json({ message: "좋아요를 눌렀습니다." });
    } catch (error) {
      next(error);
      return;
    }
  },

  removeLike: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { itemType, itemId } = req.params;
      const { userId } = req.auth!;
      let articleId: string | null = null;
      let productId: string | null = null;

      if (itemType === "articles") {
        articleId = itemId;
      } else if (itemType === "products") {
        productId = itemId;
      } else {
        return res.status(400).json({ message: "잘못된 itemType입니다." });
      }

      await likeService.removeLike(
        userId,
        articleId ? parseInt(articleId) : null,
        productId ? parseInt(productId) : null
      );
      return res.status(200).json({ message: "좋아요를 취소했습니다." });
    } catch (error) {
      next(error);
      return;
    }
  },

  getArticleLikeCount: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { articleId } = req.params;
      const count = await likeService.getArticleLikeCount(parseInt(articleId));
      return res.status(200).json({ count });
    } catch (error) {
      next(error);
      return;
    }
  },

  getProductLikeCount: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { productId } = req.params;
      const count = await likeService.getProductLikeCount(parseInt(productId));
      return res.status(200).json({ count });
    } catch (error) {
      next(error);
      return;
    }
  },
};

export default likeController;
