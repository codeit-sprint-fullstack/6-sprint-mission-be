import express from "express";
import {
  createArticle,
  deleteArticle,
  getArticle,
  getArticles,
  likeArticle,
  unlikeArticle,
  updateArticle,
} from "../controllers/articleController";
import auth from "../middlewares/auth";
import commentRouter from "./commentRouter";
import { articleValidator } from "../middlewares/validator";

const articleRouter = express.Router();

articleRouter.get("/", getArticles);
articleRouter.post(
  "/",
  auth.verifyAccessToken,
  articleValidator,

  createArticle
);
articleRouter.get("/:articleId", auth.verifyAccessToken, getArticle);
articleRouter.patch(
  "/:articleId",
  auth.verifyAccessToken,
  articleValidator,

  updateArticle
);
articleRouter.delete("/:articleId", auth.verifyAccessToken, deleteArticle);
articleRouter.post("/:articleId/like", auth.verifyAccessToken, likeArticle);
articleRouter.delete("/:articleId/like", auth.verifyAccessToken, unlikeArticle);
articleRouter.use("/:articleId/comments", commentRouter);

export default articleRouter;
