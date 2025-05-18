import commentService from '../services/commentService.js';

const commentController = {
  createComment: async (req, res, next) => {
    try {
      const { content } = req.body;
      const { userId } = req.auth; 
      const { itemType, itemId } = req.params;
      let articleId = null;
      let productId = null;

      if (itemType === 'articles') {
        articleId = itemId;
      } else if (itemType === 'products') {
        productId = itemId;
      } else {
        return res.status(400).json({ message: '잘못된 itemType입니다.' });
      }
      
      const newComment = await commentService.createComment(
        userId,
        content,
        parseInt(articleId) || null,
        parseInt(productId) || null
      );
      return res.status(201).json(newComment);
    } catch (error) {
      next(error);
    }
  },

  getCommentsByArticleId: async (req, res, next) => {
    try {
      const { articleId } = req.params;
      const comments = await commentService.getCommentsByArticleId(parseInt(articleId));
      return res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  },

  getCommentsByProductId: async (req, res, next) => {
    try {
      const { productId } = req.params;
      const comments = await commentService.getCommentsByProductId(parseInt(productId));
      return res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  },

  updateComment: async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
       const {userId} = req.auth; 
      const updatedComment = await commentService.updateComment(parseInt(commentId), userId, content);
      return res.status(200).json(updatedComment);
    } catch (error) {
      next(error);
    }
  },

  deleteComment: async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const {userId} = req.auth;  
      await commentService.deleteComment(parseInt(commentId), userId);
      return res.status(204).send();   
    } catch (error) {
      next(error);
    }
  },
};

export default commentController;