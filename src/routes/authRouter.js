import express from 'express';
import auth from '../middlewares/auth.js';
import authController from '../controllers/authController.js';

const authRouter = express.Router();

// 회원가입
authRouter.post('/signup', authController.signup);

// 로그인
authRouter.post('/signIn', auth.validateEmailAndPassword, authController.login);

// 리프레시 토큰으로 새 액세스 토큰 발급
authRouter.post('/refresh-token', auth.verifyRefreshToken, authController.refreshAccessToken);

// 사용자 정보 조회 (액세스 토큰 인증 필요)
authRouter.get('/me', auth.verifyAccessToken, authController.getUserInfo);

// 로그아웃
authRouter.post('/logout', authController.logout);

export default authRouter;