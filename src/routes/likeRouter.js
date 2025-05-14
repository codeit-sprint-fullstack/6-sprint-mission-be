import express from 'express';
import likeController from '../controllers/likeController.js';
import auth from '../middlewares/auth.js';

const likeRouter = express.Router();

// 좋아요 추가 (인증 필요)
likeRouter.post('/', auth.verifyAccessToken, likeController.addLike);

// 좋아요 취소 (인증 필요)
likeRouter.delete('/', auth.verifyAccessToken, likeController.removeLike);

// 특정 게시글의 좋아요 수 조회
likeRouter.get('/articles/:articleId/count', likeController.getArticleLikeCount);

// 특정 상품의 좋아요 수 조회
likeRouter.get('/products/:productId/count', likeController.getProductLikeCount);

export default likeRouter;