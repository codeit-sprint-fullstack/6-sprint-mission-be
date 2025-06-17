import express, { NextFunction, Response, Request } from "express";
import favoriteService from "../services/favoriteService";
import auth from "../middlewares/auth";
import { AuthenticationError, ValidationError } from "../types/errors";
import {
  FavoriteParamSchema,
  FavoriteResponseDTO,
  FavoriteResponseSchema,
} from "../dto/favorite.dto";

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
  .all(auth.verifyAccessToken)
  .post(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      if (!req.auth) throw new AuthenticationError("작성자가 아닙니다");

      try {
        const userId = req.auth.userId;

        const parsed = FavoriteParamSchema.safeParse(req.params);
        if (!parsed.success)
          throw new ValidationError("잘못된 요청 파라미터입니다.");

        const productId = parsed.data.id;

        await favoriteService.likeProduct(productId, userId);

        const response: FavoriteResponseDTO = { message: "상품 좋아요 완료" };
        const validatedResponse = FavoriteResponseSchema.parse(response);

        res.status(201).json(validatedResponse);
      } catch (error) {
        next(error);
      }
    }
  )
  .delete(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) throw new AuthenticationError("작성자가 아닙니다");

    try {
      const userId = Number(req.auth.userId);

      const parsed = FavoriteParamSchema.safeParse(req.params);
      if (!parsed.success)
        throw new ValidationError("잘못된 요청 파라미터입니다.");

      const productId = parsed.data.id;

      await favoriteService.unlikeProduct(productId, userId);

      const response: FavoriteResponseDTO = {
        message: "상품 좋아요 취소 완료",
      };
      const validatedResponse = FavoriteResponseSchema.parse(response);

      res.status(200).json(validatedResponse);
    } catch (error) {
      next(error);
    }
  });

export default favoriteController;
