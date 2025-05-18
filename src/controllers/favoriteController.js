import express from "express";
import auth from "../middlewares/auth.js";
import favoriteService from "../services/favoriteService.js";

const favoriteController = express.Router();

// 좋아요 등록 api
favoriteController.post(
  "/products/:id/favorite",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const userId = req.auth.userId;
      const productId = Number(req.params.id);

      const updatedProduct = await favoriteService.toggleFavorite(
        userId,
        productId
      );
      res.json(updatedProduct);
    } catch (err) {
      next(err);
    }
  }
);

// 좋아요 삭제 api
favoriteController.delete(
  "/products/:id/favorite",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const userId = req.auth.userId;
      const productId = Number(req.params.id);

      const existing = await favoriteService.getFavorite(userId, productId);
      if (!existing) {
        return res.status(404).json({ message: "좋아요 내역이 없습니다." });
      }

      const updatedProduct = await favoriteService.removeFavorite(
        userId,
        productId
      );
      res.json(updatedProduct);
    } catch (err) {
      next(err);
    }
  }
);

export default favoriteController;
