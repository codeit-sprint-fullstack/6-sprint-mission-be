// src/services/article.service.js
const articleModel = require("../models/article.model.js");

async function createArticle(articleData) {
  return articleModel.create(articleData);
}

async function getAllArticles() {
  return articleModel.findAll();
}

async function getArticleById(articleId, include) {
  const article = await articleModel.findById(parseInt(articleId), include);
  if (!article) {
    throw new Error("Article not found");
  }
  return article;
}

async function updateArticle(articleId, updateData) {
  return articleModel.update(parseInt(articleId), updateData);
}

async function deleteArticle(articleId) {
  return articleModel.remove(parseInt(articleId));
}

async function likeArticle(articleId, userId) {
  return articleModel.like(parseInt(articleId), userId);
}

async function unlikeArticle(articleId, userId) {
  return articleModel.unlike(parseInt(articleId), userId);
}

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  likeArticle,
  unlikeArticle,
};
