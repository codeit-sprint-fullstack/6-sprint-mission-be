import express from "express";
import commentRouter from "./comment.router";
import { verifyAccessToken } from "../middlewares/verifyToken";
import { articleValidator, validator } from "../middlewares/validator";
import {
  createArticleController,
  deleteArticleController,
  getArticleController,
  getArticlesController,
  likeArticleController,
  unlikeArticleController,
  updateArticleController,
} from "../controllers/article.controller";

const articleRouter = express.Router();

articleRouter.get("/", getArticlesController);
articleRouter.post(
  "/",
  verifyAccessToken,
  articleValidator,
  validator,
  createArticleController
);
articleRouter.get("/:articleId", verifyAccessToken, getArticleController);
articleRouter.patch(
  "/:articleId",
  verifyAccessToken,
  articleValidator,
  validator,
  updateArticleController
);
articleRouter.delete("/:articleId", verifyAccessToken, deleteArticleController);
articleRouter.post(
  "/:articleId/like",
  verifyAccessToken,
  likeArticleController
);
articleRouter.delete(
  "/:articleId/like",
  verifyAccessToken,
  unlikeArticleController
);
articleRouter.use("/:articleId/comments", commentRouter);

export default articleRouter;
