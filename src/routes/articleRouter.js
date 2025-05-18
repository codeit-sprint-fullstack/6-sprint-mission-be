import express from 'express';
import articleController from '../controllers/articleController.js';
import auth from '../middlewares/auth.js';

const articleRouter = express.Router();

// 게시글 생성 (인증 필요)
articleRouter.post('/', auth.verifyAccessToken, articleController.createArticle);

// 모든 게시글 조회
articleRouter.get('/', articleController.getArticles);

// 특정 게시글 조회
articleRouter.get('/:articleId', articleController.getArticleById);

// 게시글 수정 (인증 필요)
articleRouter.patch('/:articleId', auth.verifyAccessToken, articleController.updateArticle);

// 게시글 삭제 (인증 필요)
articleRouter.delete('/:articleId', auth.verifyAccessToken, articleController.deleteArticle);

export default articleRouter;