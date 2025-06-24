import express from 'express';
import authController from '../controllers/auth.controller';
import { wrapAsync } from '../utils/wrapAsync';

const authRouter = express.Router();

// 회원가입
authRouter.post('/signup', wrapAsync(authController.signup));

// 로그인
authRouter.post('/login', wrapAsync(authController.login));

// 토큰 갱신
authRouter.post('/refresh', wrapAsync(authController.refreshToken));

export default authRouter; 