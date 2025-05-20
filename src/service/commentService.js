import commentRepository from "../repositories/commentRepository.js";
import articleRepository from "../repositories/articleRepository.js";
import productRepository from "../repositories/productRepository.js";

/**
 * 특정 게시글의 댓글 목록 조회
 */
async function getCommentsByArticleId(articleId) {
  // 게시글이 존재하는지 확인
  const article = await articleRepository.findById(articleId);
  if (!article) {
    const error = new Error("게시글을 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  return commentRepository.findByArticleId(articleId);
}

/**
 * 특정 상품의 댓글 목록 조회
 */
async function getCommentsByProductId(productId) {
  // 상품이 존재하는지 확인
  const product = await productRepository.findById(productId);
  if (!product) {
    const error = new Error("상품을 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  return commentRepository.findByProductId(productId);
}

/**
 * 게시글에 새 댓글 작성
 */
async function createArticleComment(articleId, userId, { content }) {
  // 게시글이 존재하는지 확인
  const article = await articleRepository.findById(articleId);
  if (!article) {
    const error = new Error("게시글을 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  return commentRepository.create({
    content,
    articleId,
    userId,
  });
}

/**
 * 상품에 새 댓글 작성
 */
async function createProductComment(productId, userId, { content }) {
  // 상품이 존재하는지 확인
  const product = await productRepository.findById(productId);
  if (!product) {
    const error = new Error("상품을 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  return commentRepository.create({
    content,
    productId,
    userId,
  });
}

/**
 * 댓글 수정
 */
async function updateComment(commentId, userId, { content }) {
  // 댓글이 존재하는지 확인
  const comment = await commentRepository.findById(commentId);
  if (!comment) {
    const error = new Error("댓글을 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  // 작성자만 수정 가능
  if (comment.userId !== userId) {
    const error = new Error("댓글을 수정할 권한이 없습니다.");
    error.status = 403;
    throw error;
  }

  return commentRepository.update(commentId, { content });
}

/**
 * 댓글 삭제
 */
async function deleteComment(commentId, userId) {
  // 댓글이 존재하는지 확인
  const comment = await commentRepository.findById(commentId);
  if (!comment) {
    const error = new Error("댓글을 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  // 작성자만 삭제 가능
  if (comment.userId !== userId) {
    const error = new Error("댓글을 삭제할 권한이 없습니다.");
    error.status = 403;
    throw error;
  }

  return commentRepository.remove(commentId);
}

export default {
  getCommentsByArticleId,
  getCommentsByProductId,
  createArticleComment,
  createProductComment,
  updateComment,
  deleteComment,
};
