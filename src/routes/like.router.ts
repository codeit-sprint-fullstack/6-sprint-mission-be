import express from 'express';
import likeController from '../controllers/like.controller';
import auth from '../middlewares/auth';
import { wrapAsync } from '../utils/wrapAsync';

const likeRouter = express.Router();

// 좋아요 추가 (인증 필요)
likeRouter.post('/:itemType/:itemId', auth.verifyAccessToken, wrapAsync(likeController.addLike));

// 좋아요 취소 (인증 필요)
likeRouter.delete('/:itemType/:itemId', auth.verifyAccessToken, wrapAsync(likeController.removeLike));

// 특정 게시글의 좋아요 수 조회
likeRouter.get('/articles/:articleId/count', wrapAsync(likeController.getArticleLikeCount));

// 특정 상품의 좋아요 수 조회
likeRouter.get('/products/:productId/count', wrapAsync(likeController.getProductLikeCount));

export default likeRouter;  