import express from "express";
import auth from "../middlewares/auth.js";
import articleService from "../services/articleService.js";

const articleController = express.Router();

articleController.post("/", auth.varifyAccessToken, async (req, res, next) => {
  const { userId } = req.auth;
  const createdArticle = await articleService.create({
    ...req.body,
    authorId: userId,
  });
  return res.json(createdArticle);
});

articleController.get("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  const article = await articleService.getById(id);
  return res.json(article);
});

articleController.get("/", async (req, res, next) => {
  const articles = await articleService.getAll();
  return res.json(articles);
});

articleController.patch(
  "/:id",
  auth.varifyAccessToken,
  async (req, res, next) => {
    const id = Number(req.params.id);
    const patchedArticle = await articleService.update(id, req.body);
    return res.json(patchedArticle);
  }
);

articleController.delete(
  "/:id",
  auth.varifyAccessToken,
  async (req, res, next) => {
    const id = Number(req.params.id);
    const deletedArticle = await articleService.deleteById(id);
    return res.json(deletedArticle);
  }
);

export default articleController;
