import productCommentRepository from "../repositories/productCommentRepository.js";

// 상품 댓글 조회
async function getProductComments(productId, { limit = 5, cursor = null }) {
  const comments = await productCommentRepository.findByProductId({
    productId,
    limit,
    cursor,
  });

  const nextCursor =
    comments.length === limit ? comments[comments.length - 1].id : null;

  return {
    list: comments,
    nextCursor,
  };
}

// 상품 댓글 등록
async function createProductComment(productId, userId, content) {
  return productCommentRepository.create({
    content,
    userId,
    productId,
  });
}

export default {
  getProductComments,
  createProductComment,
};
