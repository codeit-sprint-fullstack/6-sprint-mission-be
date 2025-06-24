import express from 'express';
import articleController from '../controllers/article.controller';
import auth from '../middlewares/auth';
import { wrapAsync } from '../utils/wrapAsync';

const articleRouter = express.Router();

// 게시글 생성 (인증 필요)
articleRouter.post('/', auth.verifyAccessToken, wrapAsync(articleController.createArticle));

// 모든 게시글 조회
articleRouter.get('/', wrapAsync(articleController.getArticles));

// 특정 게시글 조회
articleRouter.get('/:articleId', wrapAsync(articleController.getArticleById));

// 게시글 수정 (인증 필요)
articleRouter.patch('/:articleId', auth.verifyAccessToken, wrapAsync(articleController.updateArticle));

// 게시글 삭제 (인증 필요)
articleRouter.delete('/:articleId', auth.verifyAccessToken, wrapAsync(articleController.deleteArticle));

export default articleRouter; 