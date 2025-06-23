import express, { NextFunction, Request, Response } from "express";
import auth from "../middlewares/auth";
import favoriteService from "../services/favoriteService";

const favoriteController = express.Router();

// 사용자 인증 객체 확장
interface AuthenticatedRequest extends Request {
  auth?: {
    userId: number;
  };
}

// 좋아요 등록 및 취소 api
favoriteController.post(
  "/products/:id/favorite",
  auth.verifyAccessToken,
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.auth?.userId;
      const productId = Number(req.params.id);

      if (!userId) {
        res.status(401).json({ message: "인증 정보가 없습니다." });
        return;
      }

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

export default favoriteController;

// // 사실 등록에서 토글로 처리해서 프론트에서는 굳이 필요없음. 이는 서버에서 직접 제거용
// // 좋아요 삭제 api
// favoriteController.delete(
//   "/products/:id/favorite",
//   auth.verifyAccessToken,
//   async (req, res, next) => {
//     try {
//       const userId = req.auth.userId;
//       const productId = Number(req.params.id);

//       const existing = await favoriteService.getFavorite(userId, productId);
//       if (!existing) {
//         return res.status(404).json({ message: "좋아요 내역이 없습니다." });
//       }

//       const updatedProduct = await favoriteService.removeFavorite(
//         userId,
//         productId
//       );
//       res.json(updatedProduct);
//     } catch (err) {
//       next(err);
//     }
//   }
// );
