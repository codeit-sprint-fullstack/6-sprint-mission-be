import commentRepository from "../repositories/commentRepository";
import articleRepository from "../repositories/articleRepository";
import productRepository from "../repositories/productRepository";
import { Article, Comment, Product, User } from "@prisma/client";
import { ForbiddenError, NotFoundError } from "../types/commonError";

/**
 * 특정 게시글의 댓글 목록 조회
 */
async function getCommentsByArticleId(articleId: Article["id"]) {
  // 게시글이 존재하는지 확인
  const article = await articleRepository.findById(articleId);
  if (!article) {
    throw new NotFoundError("게시글을 찾을 수 없습니다.");
  }

  return commentRepository.findByArticleId(articleId);
}

/**
 * 특정 상품의 댓글 목록 조회
 */
async function getCommentsByProductId(productId: Product["id"]) {
  // 상품이 존재하는지 확인
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new NotFoundError("상품을 찾을 수 없습니다.");
  }

  return commentRepository.findByProductId(productId);
}

/**
 * 게시글에 새 댓글 작성
 */
async function createArticleComment(
  articleId: Article["id"],
  content: Comment["content"],
  userId: User["id"]
) {
  // 게시글이 존재하는지 확인

  const article = await articleRepository.findById(articleId);
  if (!article) {
    throw new NotFoundError("게시글을 찾을 수 없습니다.");
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
async function createProductComment(
  productId: Product["id"],
  userId: User["id"],
  content: Comment["content"]
) {
  // 상품이 존재하는지 확인
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new NotFoundError("상품을 찾을 수 없습니다.");
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
async function updateComment(
  commentId: Comment["id"],
  userId: User["id"],
  content: Comment["content"]
) {
  // 댓글이 존재하는지 확인
  const comment = await commentRepository.findById(commentId);
  if (!comment) {
    throw new NotFoundError("댓글을 찾을 수 없습니다.");
  }

  // 작성자만 수정 가능
  if (comment.userId !== userId) {
    throw new ForbiddenError("댓글을 수정할 권한이 없습니다.");
  }

  return commentRepository.update(commentId, { content });
}

/**
 * 댓글 삭제
 */
async function deleteComment(commentId: Comment["id"], userId: User["id"]) {
  // 댓글이 존재하는지 확인
  const comment = await commentRepository.findById(commentId);
  if (!comment) {
    throw new NotFoundError("댓글을 찾을 수 없습니다.");
  }

  // 작성자만 삭제 가능
  if (comment.userId !== userId) {
    throw new ForbiddenError("댓글을 삭제할 권한이 없습니다.");
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
