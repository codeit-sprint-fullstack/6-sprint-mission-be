import express from "express";
import {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  likeArticle,
  unlikeArticle,
} from "../controllers/articleController.js";
import { verifyAccessToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// /articles 경로에 대한 라우트
router.route("/").get(getAllArticles).post(verifyAccessToken, createArticle);

// /articles/:articleId 경로에 대한 라우트
router
  .route("/:articleId")
  .get(getArticleById)
  .patch(verifyAccessToken, updateArticle)
  .delete(verifyAccessToken, deleteArticle);

// /articles/:articleId/like 경로에 대한 라우트
router
  .route("/:articleId/like")
  .post(verifyAccessToken, likeArticle)
  .delete(verifyAccessToken, unlikeArticle);

export default router;
