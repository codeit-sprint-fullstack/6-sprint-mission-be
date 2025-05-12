import express from "express";
import favoriteService from "../services/favoriteService.js";
import auth from "../middlewares/auth.js";

const favoriteController = express.Router();

favoriteController
  .route("/product/:id")
  .all(auth.varifyAccessToken)
  .post(async (req, res, next) => {
    const userId = Number(req.auth.userId);
    const productId = Number(req.params.id);

    try {
      await favoriteService.likeProduct(productId, userId);
      res.status(201).json({ message: "상품 좋아요 완료" });
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    const userId = Number(req.auth.userId);
    const productId = Number(req.params.id);

    try {
      await favoriteService.unlikeProduct(productId, userId);
      res.status(200).json({ message: "상품 좋아요 취소 완료" });
    } catch (error) {
      next(error);
    }
  });

export default favoriteController;
