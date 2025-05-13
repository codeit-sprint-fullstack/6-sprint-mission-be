import express from "express";
import {
  createArticle,
  deleteArticle,
  getArticle,
  getArticles,
  likeArticle,
  unlikeArticle,
  updateArticle,
} from "../controllers/articleController.js";
import auth from "../middlewares/auth.js";
import commentRouter from "./commentRouter.js";
import { articleValidator, validate } from "../middlewares/validator.js";

const articleRouter = express.Router();

articleRouter.get("/", getArticles);
articleRouter.post(
  "/",
  auth.verifyAccessToken,
  articleValidator,
  validate,
  createArticle
);
articleRouter.get("/:articleId", auth.verifyAccessToken, getArticle);
articleRouter.patch(
  "/:articleId",
  auth.verifyAccessToken,
  articleValidator,
  validate,
  updateArticle
);
articleRouter.delete("/:articleId", auth.verifyAccessToken, deleteArticle);
articleRouter.post("/:articleId/like", auth.verifyAccessToken, likeArticle);
articleRouter.delete("/:articleId/like", auth.verifyAccessToken, unlikeArticle);
articleRouter.use("/:articleId/comments", commentRouter);

export default articleRouter;
