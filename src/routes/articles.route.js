import express from "express";
import articleController from "../controllers/articleController.js";
import auth from "../middlewares/users/auth.js";

const articlesRouter = express.Router();

// 게시글
articlesRouter.get("/", auth.verifyOptionalAuth, articleController.getArticles);
articlesRouter.get(
  "/:articleId",
  auth.verifyOptionalAuth,
  articleController.getArticleById
);
articlesRouter.post(
  "/",
  auth.verifyAccessToken,
  articleController.createArticle
);
articlesRouter.patch(
  "/:articleId",
  auth.verifyAccessToken,
  articleController.updateArticle
);
articlesRouter.delete(
  "/:articleId",
  auth.verifyAccessToken,
  articleController.deleteArticle
);
articlesRouter.patch(
  "/:articleId/like",
  auth.verifyAccessToken,
  articleController.increaseLike
);

// 좋아요
articlesRouter.post(
  "/:articleId/like",
  auth.verifyAccessToken,
  articleController.likeArticle
);
articlesRouter.delete(
  "/:articleId/like",
  auth.verifyAccessToken,
  articleController.unlikeArticle
);

// 댓글
articlesRouter.get(
  "/:articleId/comments",
  auth.verifyAccessToken,
  articleController.getCommentsByArticleId
);
articlesRouter.post(
  "/:articleId/comments",
  auth.verifyAccessToken,
  articleController.createComment
);
articlesRouter.patch(
  "/:articleId/comments/:commentId",
  auth.verifyAccessToken,
  articleController.updateComment
);
articlesRouter.delete(
  "/:articleId/comments/:commentId",
  auth.verifyAccessToken,
  articleController.deleteComment
);

export default articlesRouter;
