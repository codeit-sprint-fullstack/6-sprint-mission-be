import express from 'express';
import * as articleController from '../controllers/articleController';
import { errorHandler } from '../middlewares/errorHandler';
import { authMiddleware } from '../middlewares/authMiddleware'; // 추가한 인증 미들웨어

const router = express.Router();

router.post('/', authMiddleware, errorHandler(articleController.createArticle));
router.get('/', errorHandler(articleController.getArticles));
router.get('/:articleId', errorHandler(articleController.getArticle));
router.patch('/:articleId', authMiddleware, errorHandler(articleController.updateArticle));
router.delete('/:articleId', authMiddleware, errorHandler(articleController.deleteArticle));
// router.post('/:articleId/comments', authMiddleware, errorHandler(articleController.createComment));
// router.get('/:articleId/comments', errorHandler(articleController.listComments));
router.post('/:articleId/like', authMiddleware, errorHandler(articleController.toggleLike));

export default router;
