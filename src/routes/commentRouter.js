import express from 'express';
import commentController from '../controllers/commentController.js';
import auth from '../middlewares/auth.js';

const commentRouter = express.Router();

// 댓글 생성 (인증 필요)
commentRouter.post('/', auth.verifyAccessToken, commentController.createComment);

// 특정 게시글의 모든 댓글 조회
commentRouter.get('/articles/:articleId', commentController.getCommentsByArticleId);

// 특정 상품의 모든 댓글 조회
commentRouter.get('/products/:productId', commentController.getCommentsByProductId);

// 특정 댓글 수정 (인증 필요)
commentRouter.put('/:commentId', auth.verifyAccessToken, commentController.updateComment);

// 특정 댓글 삭제 (인증 필요)
commentRouter.delete('/:commentId', auth.verifyAccessToken, commentController.deleteComment);

export default commentRouter;