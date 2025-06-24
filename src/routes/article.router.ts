import express from "express";
import articleController from "../controllers/article.controller";
import auth from "../middlewares/auth";

const articleRouter = express.Router();

// 게시글 목록 불러오기
articleRouter.get("/", auth.verifyAccessToken, articleController.getArticles);

// 게시글 상세조회
articleRouter.get(
  "/:articleId",
  auth.verifyAccessToken,
  articleController.getArticle
);

// 게시글 작성
articleRouter.post(
  "/",
  auth.verifyAccessToken,
  articleController.createArticle
);

// 게시글 수정
articleRouter.patch(
  "/:articleId",
  auth.verifyAccessToken,
  articleController.updateArticle
);

// 게시글 삭제
articleRouter.delete(
  "/:articleId",
  auth.verifyAccessToken,
  articleController.deleteArticle
);

// 게시글 좋아요
articleRouter.post(
  "/:articleId/like",
  auth.verifyAccessToken,
  articleController.addlikeArticle
);

// 게시글 좋아요 취소
articleRouter.delete(
  "/:articleId/like",
  auth.verifyAccessToken,
  articleController.cancelLikeArticle
);

export default articleRouter;
