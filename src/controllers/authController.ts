import express, { NextFunction, Request, Response } from "express";
import authService from "../services/authService";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/utils";
import {
  AuthenticationError,
  NotFoundError,
  ValidationError,
} from "../types/errors";
import auth from "../middlewares/auth";
import { SignInBodySchema, SignUpBodySchema } from "../dto/auth.dto";

const authController = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 인증 관련 API
 */

/**
 * @swagger
 * /auth/signUp:
 *   post:
 *     summary: 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - nickname
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               nickname:
 *                 type: string
 *                 example: pandaUser
 *     responses:
 *       200:
 *         description: 회원가입 성공 및 access token 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     nickname:
 *                       type: string
 *       400:
 *         description: 잘못된 요청
 */

/**
 * @swagger
 * /auth/signIn:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: 로그인 성공, access token과 사용자 정보 반환
 *       404:
 *         description: 존재하지 않는 사용자
 */

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: access token 갱신
 *     tags: [Auth]
 *     description: refresh token이 쿠키에 있어야 함
 *     responses:
 *       200:
 *         description: 새 access token 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: refresh token 없음
 *       403:
 *         description: refresh token 유효하지 않음
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: 로그아웃
 *     tags: [Auth]
 *     description: refresh token 쿠키 제거
 *     responses:
 *       200:
 *         description: 로그아웃 완료
 */

// 회원가입
authController.post(
  "/signUp",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = SignUpBodySchema.safeParse(req.body);
      if (!parsed.success)
        throw new ValidationError("요청 형식을 올바르게 작성해주세요");

      const existedUser = await authService.getByEmail(parsed.data.email);
      if (existedUser) throw new ValidationError("이미 사용중인 이메일입니다.");

      const createUser = await authService.create(parsed.data);
      const accessToken = generateAccessToken(createUser);

      res.status(200).json({
        accessToken,
        user: {
          id: createUser.id,
          email: createUser.email,
          nickname: createUser.nickname,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

//로그인
authController.post(
  "/signIn",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = SignInBodySchema.safeParse(req.body);
      if (!parsed.success)
        throw new ValidationError("요청 형식이 올바르지 않습니다.");

      const user = await authService.getByEmail(parsed.data.email);
      if (!user) throw new NotFoundError("존재하지 않는 사용자입니다.");

      const accessToken = authService.createAccessToken(user.id);
      const refreshToken = authService.createRefreshToken(user.id);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, //개발 단계에서는 http를 사용중임
        sameSite: "none",
        maxAge: 14 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      res.json({ ...user, accessToken });
    } catch (error) {
      next(error);
    }
  }
);

//리프레쉬 토큰 발급
authController.post(
  "/refresh",
  auth.verifyAccessToken,
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken)
        res.status(401).json({ message: "리프레쉬 토큰이 없습니다." });

      const payload = req.auth;
      if (!payload) throw new AuthenticationError("접근 권한이 없습니다.");

      const user = {
        id: payload.userId,
        email: payload.email,
        nickname: payload.nickname,
      };

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false, //개발 환경은 http 사용중임
        sameSite: "none",
        maxAge: 14 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(403).json({ message: "토큰을 찾을 수 없습니다." });
    }
  }
);

authController.post(
  "/logout",
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false, //개발 중에는 http 사용중
        sameSite: "none",
        path: "/",
      });
      res.status(200).json({ message: "로그아웃 완료" });
    } catch (error) {
      next(error);
    }
  }
);

export default authController;
