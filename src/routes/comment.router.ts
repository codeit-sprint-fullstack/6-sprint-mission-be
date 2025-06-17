import express from 'express';
import commentController from '../controllers/comment.controller';
import auth from '../middlewares/auth';
import { wrapAsync } from '../utils/wrapAsync';

const commentRouter = express.Router();

// 댓글 생성 (인증 필요)
commentRouter.post('/:itemType/:itemId', auth.verifyAccessToken, wrapAsync(commentController.createComment));

// 특정 게시글의 모든 댓글 조회
commentRouter.get('/articles/:articleId', wrapAsync(commentController.getCommentsByArticleId));

// 특정 상품의 모든 댓글 조회
commentRouter.get('/products/:productId', wrapAsync(commentController.getCommentsByProductId));

// 특정 댓글 수정 (인증 필요)
commentRouter.patch('/:commentId', auth.verifyAccessToken, wrapAsync(commentController.updateComment));

// 특정 댓글 삭제 (인증 필요)
commentRouter.delete('/:commentId', auth.verifyAccessToken, wrapAsync(commentController.deleteComment));

export default commentRouter; 