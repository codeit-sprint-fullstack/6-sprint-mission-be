import express from "express";
import auth from "../middlewares/auth.js";
import articleService from "../services/articleService.js";

const articleController = express.Router();
const articleCommentController = express.Router();

articleController
  .route("/")
  .post(auth.varifyAccessToken, async (req, res, next) => {
    const { userId } = req.auth;
    try {
      const createdArticle = await articleService.create({
        ...req.body,
        authorId: userId,
      });
      return res.json(createdArticle);
    } catch (error) {
      next(error);
    }
  })
  .get(async (req, res, next) => {
    try {
      const articles = await articleService.getAll();
      return res.json(articles);
    } catch (error) {
      next(error);
    }
  });

articleController
  .route("/:id")
  .get(async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const article = await articleService.getById(id);
      return res.json(article);
    } catch (error) {
      next(error);
    }
  })
  .patch(auth.varifyAccessToken, async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const patchedArticle = await articleService.update(id, req.body);
      return res.json(patchedArticle);
    } catch (error) {
      next(error);
    }
  })
  .delete(auth.varifyAccessToken, async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const deletedArticle = await articleService.deleteById(id);
      return res.json(deletedArticle);
    } catch (error) {
      next(error);
    }
  });

articleCommentController
  .route("/:id/comments")
  .post(auth.varifyAccessToken, async (req, res, next) => {
    const { userId } = req.auth;
    const id = Number(req.params.id);
    try {
      const articleComment = await articleService.createArticleComment({
        ...req.body,
        articleId: id,
        authorId: userId,
      });
      return res.json(articleComment);
    } catch (error) {
      next(error);
    }
  })
  .get(async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const articleComments = await articleService.getAllArticleComment(id);
      return res.json(articleComments);
    } catch (error) {
      next(error);
    }
  });

articleController.use("/", articleCommentController);

export default articleController;
