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
import commentRouter from "./commentRouter";
import { articleValidator, validator } from "../middlewares/validator";
import { verifyAccessToken } from "../middlewares/verifyToken";

const articleRouter = express.Router();

articleRouter.get("/", getArticles);
articleRouter.post(
  "/",
  verifyAccessToken,
  articleValidator,
  validator,
  createArticle
);
articleRouter.get("/:articleId", verifyAccessToken, getArticle);
articleRouter.patch(
  "/:articleId",
  verifyAccessToken,
  articleValidator,
  validator,
  updateArticle
);
articleRouter.delete("/:articleId", verifyAccessToken, deleteArticle);
articleRouter.post("/:articleId/like", verifyAccessToken, likeArticle);
articleRouter.delete("/:articleId/like", verifyAccessToken, unlikeArticle);
articleRouter.use("/:articleId/comments", commentRouter);

export default articleRouter;
