import likeService from '../services/likeService.js';

const likeController = {
  addLike: async (req, res, next) => {
    try {
      const { articleId, productId } = req.body;
      const userId = req.auth.id;  
      await likeService.addLike(userId, parseInt(articleId) || null, parseInt(productId) || null);
      return res.status(201).json({ message: '좋아요를 눌렀습니다.' });
    } catch (error) {
      next(error);
    }
  },

  removeLike: async (req, res, next) => {
    try {
      const { articleId, productId } = req.body;
      const userId = req.auth.id;  
      await likeService.removeLike(userId, parseInt(articleId) || null, parseInt(productId) || null);
      return res.status(200).json({ message: '좋아요를 취소했습니다.' });
    } catch (error) {
      next(error);
    }
  },

  getArticleLikeCount: async (req, res, next) => {
    try {
      const { articleId } = req.params;
      const count = await likeService.getArticleLikeCount(parseInt(articleId));
      return res.status(200).json({ count });
    } catch (error) {
      next(error);
    }
  },

  getProductLikeCount: async (req, res, next) => {
    try {
      const { productId } = req.params;
      const count = await likeService.getProductLikeCount(parseInt(productId));
      return res.status(200).json({ count });
    } catch (error) {
      next(error);
    }
  },
};

export default likeController;