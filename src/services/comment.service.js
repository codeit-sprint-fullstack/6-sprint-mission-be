// src/services/comment.service.js
const commentModel = require("../models/comment.model.js");

async function createProductComment(content, userId, productId) {
  return commentModel.create({ content, userId, productId });
}

async function getProductComments(productId, include) {
  return commentModel.findManyByProductId(productId, include);
}

async function createArticleComment(content, userId, articleId) {
  return commentModel.create({ content, userId, articleId });
}

async function getArticleComments(articleId, include) {
  return commentModel.findManyByArticleId(articleId, include);
}

async function updateComment(commentId, updateData) {
  const existingComment = await commentModel.findById(commentId);
  if (!existingComment) {
    throw new Error("Comment not found"); // 또는 사용자 정의 에러
  }
  return commentModel.update(commentId, updateData);
}

async function deleteComment(commentId) {
  const existingComment = await commentModel.findById(commentId);
  if (!existingComment) {
    throw new Error("Comment not found"); // 또는 사용자 정의 에러
  }
  return commentModel.remove(commentId);
}

module.exports = {
  createProductComment,
  getProductComments,
  createArticleComment,
  getArticleComments,
  updateComment,
  deleteComment,
};
