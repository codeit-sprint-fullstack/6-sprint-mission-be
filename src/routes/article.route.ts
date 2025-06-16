import express from 'express';
import {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  likeArticle,
  unlikeArticle,
} from '../controllers/article.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', authMiddleware, createArticle);
router.get('/', getAllArticles);
router.get('/:articleId', getArticleById);
router.patch('/:articleId', authMiddleware, updateArticle);
router.delete('/:articleId', authMiddleware, deleteArticle);
router.post('/:articleId/like', authMiddleware, likeArticle);
router.delete('/:articleId/like', authMiddleware, unlikeArticle);

export default router;