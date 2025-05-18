import commentRepository from '../repositories/commentRepository.js';

const commentService = {
  createComment: async (userId, content, articleId, productId) => {
    if (!articleId && !productId) {
      throw { status: 400, message: '게시글 ID 또는 상품 ID 중 하나는 필수입니다.' };
    }
    return commentRepository.createComment(userId, content, articleId, productId);
  },

  getCommentsByArticleId: async (articleId) => {
    return commentRepository.findAllCommentsByArticleId(articleId);
  },

  getCommentsByProductId: async (productId) => {
    return commentRepository.findAllCommentsByProductId(productId);
  },

  getCommentById: async (id) => {
    const comment = await commentRepository.findCommentById(id);
    if (!comment) {
      throw { status: 404, message: '댓글을 찾을 수 없습니다.' };
    }
    return comment;
  },

  updateComment: async (id, userId, content) => {
    const comment = await commentRepository.findCommentById(id);
    if (!comment) {
      throw { status: 404, message: '댓글을 찾을 수 없습니다.' };
    }
    if (comment.userId !== userId) {
      throw { status: 403, message: '댓글 수정 권한이 없습니다.' };
    }
    return commentRepository.updateComment(id, content);
  },

  deleteComment: async (id, userId) => {
    const comment = await commentRepository.findCommentById(id);
    if (!comment) {
      throw { status: 404, message: '댓글을 찾을 수 없습니다.' };
    }
    if (comment.userId !== userId) {
      throw { status: 403, message: '댓글 삭제 권한이 없습니다.' };
    }
    return commentRepository.deleteComment(id);
  },
};

export default commentService;