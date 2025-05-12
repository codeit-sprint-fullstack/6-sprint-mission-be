import express from 'express';
import * as commentController from '../controllers/commentController.js';
import { errorHandler } from '../middlewares/errorHandler.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ✅ 게시글 댓글 생성 (인증 필요)
router.post(
    '/articles/:articleId/comments',
    authMiddleware,
    errorHandler(commentController.createArticleComment),
);

// ✅ 게시글 댓글 목록 조회 (비인증)
router.get('/articles/:id/comments', errorHandler(commentController.listComments));

// ✅ 게시글 댓글 수정 (인증 필요)
router.patch(
    '/articles/comments/:commentId',
    authMiddleware,
    errorHandler(commentController.updateArticleComment),
);

// ✅ 게시글 댓글 삭제 (인증 필요)
router.delete(
    '/articles/comments/:commentId',
    authMiddleware,
    errorHandler(commentController.deleteArticleComment),
);

// ✅ 상품 댓글 생성 (인증 필요)
router.post(
    '/products/:productId/comments',
    authMiddleware,
    errorHandler(commentController.createProductComment),
);

// ✅ 상품 댓글 목록 조회 (비인증)
router.get('/products/:id/comments', errorHandler(commentController.listComments));

// ✅ 상품 댓글 수정 (인증 필요)
router.patch(
    '/products/comments/:commentId',
    authMiddleware,
    errorHandler(commentController.updateProductComment),
);

// ✅ 상품 댓글 삭제 (인증 필요)
router.delete(
    '/products/comments/:commentId',
    authMiddleware,
    errorHandler(commentController.deleteProductComment),
);

export default router;
