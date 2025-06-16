import express from 'express';
import * as userController from '../controllers/userController';
import { errorHandler } from '../middlewares/errorHandler';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// 내 정보 조회
router.get('/me', authMiddleware, errorHandler(userController.getMe));

// 내 정보 수정 (프로필 이미지 등)
router.patch('/me', authMiddleware, errorHandler(userController.updateMe));

// 내 비밀번호 수정
router.patch('/me/password', authMiddleware, errorHandler(userController.updateMyPassword));

// 내가 등록한 상품 조회
router.get('/me/products', authMiddleware, errorHandler(userController.getMyProduct));

// 내가 등록한 게시글 조회
router.get('/me/articles', authMiddleware, errorHandler(userController.getMyArticle));

// 내가 좋아요한 항목들 조회
router.get('/me/favorites', authMiddleware, errorHandler(userController.getMyFavorites));

export default router;
