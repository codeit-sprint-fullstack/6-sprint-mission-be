import express from 'express';
import * as commentController from '../controllers/commentController';
import { errorHandler } from '../middlewares/errorHandler';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// ✅ 게시글 댓글 목록 조회 (비인증)
router.get('/articles/:id/comments', errorHandler(commentController.getArticleComments));

// ✅ 상품 댓글 목록 조회 (비인증)
router.get('/products/:id/comments', errorHandler(commentController.getProductComments));

// ✅ 게시글 댓글 생성 (인증 필요)
router.post(
    '/articles/:articleId/comments',
    authMiddleware,
    errorHandler(commentController.createArticleComment),
);

// ✅ 상품 댓글 생성 (인증 필요)
router.post(
    '/products/:productId/comments',
    authMiddleware,
    errorHandler(commentController.createProductComment),
);

// ✅ 댓글 수정 (인증 필요)
router.patch('/comments/:commentId', authMiddleware, errorHandler(commentController.updateComment));

// ✅ 댓글 삭제 (인증 필요)
router.delete(
    '/comments/:commentId',
    authMiddleware,
    errorHandler(commentController.deleteComment),
);

export default router;
