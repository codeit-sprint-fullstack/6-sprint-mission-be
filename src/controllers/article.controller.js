// src/controllers/article.controller.js
const articleService = require("../services/article.service.js");
const catchAsync = require("../utils/catchAsync.js");

exports.createArticle = catchAsync(async (req, res) => {
  const newArticle = await articleService.createArticle({
    ...req.body,
    userId: req.user.id,
  });
  res.status(201).send(newArticle);
});

exports.getAllArticles = catchAsync(async (req, res) => {
  const articles = await articleService.getAllArticles();
  res.send(articles);
});

exports.getArticleById = catchAsync(async (req, res) => {
  const article = await articleService.getArticleById(
    req.params.articleId /*, { user, comments } */
  );
  res.send(article);
});

exports.updateArticle = catchAsync(async (req, res) => {
  const updatedArticle = await articleService.updateArticle(
    req.params.articleId,
    req.body
  );
  res.send(updatedArticle);
});

exports.deleteArticle = catchAsync(async (req, res) => {
  await articleService.deleteArticle(req.params.articleId);
  res.status(204).send();
});

exports.likeArticle = catchAsync(async (req, res) => {
  await articleService.likeArticle(parseInt(req.params.articleId), req.user.id);
  res.send({ message: "Article liked" });
});

exports.unlikeArticle = catchAsync(async (req, res) => {
  await articleService.unlikeArticle(
    parseInt(req.params.articleId),
    req.user.id
  );
  res.status(204).send();
});
