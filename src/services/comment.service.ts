import commentRepository from '../repositories/comment.repository';

const commentService = {
  createComment: async (userId: string, content: string, articleId: number | null, productId: number | null) => {
    if (!articleId && !productId) {
      throw { status: 400, message: '게시글 ID 또는 상품 ID 중 하나는 필수입니다.' };
    }
    return commentRepository.createComment(userId, content, articleId, productId);
  },

  getCommentsByArticleId: async (articleId: number) => {
    return commentRepository.findAllCommentsByArticleId(articleId);
  },

  getCommentsByProductId: async (productId: number) => {
    return commentRepository.findAllCommentsByProductId(productId);
  },

  getCommentById: async (id: number) => {
    const comment = await commentRepository.findCommentById(id);
    if (!comment) {
      throw { status: 404, message: '댓글을 찾을 수 없습니다.' };
    }
    return comment;
  },

  updateComment: async (id: number, userId: string, content: string) => {
    const comment = await commentRepository.findCommentById(id);
    if (!comment) {
      throw { status: 404, message: '댓글을 찾을 수 없습니다.' };
    }
    if (comment.userId !== userId) {
      throw { status: 403, message: '댓글 수정 권한이 없습니다.' };
    }
    return commentRepository.updateComment(id, content);
  },

  deleteComment: async (id: number, userId: string) => {
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