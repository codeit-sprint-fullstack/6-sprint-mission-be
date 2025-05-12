import commentRepository from "../repositories/commentRepository.js";

async function create(commentData) {
  return await commentRepository.createComment(commentData);
}

async function getByArticleId(articleId) {
  return await commentRepository.getCommentsByArticleId(articleId);
}

async function getByProductId(productId) {
  return await commentRepository.getCommentsByProductId(productId);
}

async function update(commentId, newContent) {
  return await commentRepository.updateComment(commentId, newContent);
}

async function deleteById(commentId) {
  return await commentRepository.deleteComment(commentId);
}

export default {
  create,
  getByArticleId,
  getByProductId,
  update,
  deleteById,
};
