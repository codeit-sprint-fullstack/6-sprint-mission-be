import express from "express";
import commentRouter from "./commentRouter.js";
import {
  createArticle,
  deleteArticle,
  getArticle,
  getArticles,
  updateArticle,
} from "../controllers/articleController.js";

const articleRouter = express.Router();

articleRouter.post("/articles", createArticle);
articleRouter.get("/articles", getArticles);
articleRouter.get("/articles/:articleId", getArticle);
articleRouter.patch("/articles/:articleId", updateArticle);
articleRouter.delete("/articles/:articleId", deleteArticle);
articleRouter.use("/:articleId/comments", commentRouter);

export default articleRouter;
