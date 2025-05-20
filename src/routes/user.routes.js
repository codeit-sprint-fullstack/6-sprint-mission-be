import express from "express";
import {
  getMe,
  updateMe,
  changePassword,
  getMyProducts,
  getMyFavorites,
} from "../controllers/userController.js";

import { verifyAccessToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// /me 경로에 대한 라우트 통합
router
  .route("/me")
  .get(verifyAccessToken, getMe)
  .patch(verifyAccessToken, updateMe);
router.patch("/me/password", verifyAccessToken, changePassword);
router.get("/me/products", verifyAccessToken, getMyProducts);
router.get("/me/favorites", verifyAccessToken, getMyFavorites);

export default router;
