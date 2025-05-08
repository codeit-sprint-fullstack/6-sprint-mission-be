// src/controllers/article.controller.js
const prisma = require("../models/prisma/prismaClient.js");
const catchAsync = require("../utils/catchAsync.js");

exports.createArticle = catchAsync(async (req, res) => {
  const newArticle = await prisma.article.create({
    data: { ...req.body, userId: req.user.id },
  });
  res.status(201).send(newArticle);
});

exports.getAllArticles = catchAsync(async (req, res) => {
  const articles = await prisma.article.findMany();
  res.send(articles);
});

exports.getArticleById = catchAsync(async (req, res) => {
  const article = await prisma.article.findUnique({
    where: { id: parseInt(req.params.articleId) },
    include: { user, comments }, // 필요에 따라 include
  });
  if (!article) {
    return res.status(404).send({ message: "Article not found" });
  }
  res.send(article);
});

exports.updateArticle = catchAsync(async (req, res) => {
  const updatedArticle = await prisma.article.update({
    where: { id: parseInt(req.params.articleId) },
    data: req.body,
  });
  res.send(updatedArticle);
});

exports.deleteArticle = catchAsync(async (req, res) => {
  await prisma.article.delete({
    where: { id: parseInt(req.params.articleId) },
  });
  res.status(204).send();
});

exports.likeArticle = catchAsync(async (req, res) => {
  // Article 좋아요 로직 구현 (User 모델과 Article 모델 간의 Many-to-Many 관계 필요)
  // 예: await prisma.article.update({ where: { id: parseInt(req.params.articleId) }, data: { likes: { connect: { id: req.user.id } } } });
  res.send({ message: "Article liked" });
});

exports.unlikeArticle = catchAsync(async (req, res) => {
  // Article 좋아요 취소 로직 구현 (User 모델과 Article 모델 간의 Many-to-Many 관계 필요)
  // 예: await prisma.article.update({ where: { id: parseInt(req.params.articleId) }, data: { likes: { disconnect: { id: req.user.id } } } });
  res.status(204).send();
});
