import express from "express";
import favoriteService from "../services/favoriteService.js";
import auth from "../middlewares/auth.js";

const favoriteController = express.Router();

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: 좋아요 관련 API
 */

/**
 * @swagger
 * /favorites/product/{id}:
 *   post:
 *     summary: 상품 좋아요 등록
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 좋아요를 등록할 상품 ID
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: 상품 좋아요 완료
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 상품을 찾을 수 없음
 *
 *   delete:
 *     summary: 상품 좋아요 취소
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 좋아요를 취소할 상품 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 상품 좋아요 취소 완료
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 상품을 찾을 수 없음
 */

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
