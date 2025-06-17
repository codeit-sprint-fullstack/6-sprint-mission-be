import { CreateUserDto, LoginUserDto } from "../dtos/user.dto.js";
import auth from "../middlewares/auth.js";
import userService from "../services/userService.js";
import express, { NextFunction, Request, Response } from "express";

const userController = express.Router();

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: 회원가입
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - nickname
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               nickname:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               image:
 *                 type: string
 *                 description: 프로필 이미지 URL
 *     responses:
 *       201:
 *         description: 회원가입 성공
 */
userController.post(
  "/signup",
  async (
    req: Request<{}, {}, CreateUserDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, nickname, password, image } = req.body;
      if (!email || !nickname || !password) {
        const error = new Error("모두 필요합니다.") as TError;
        error.code = 422;
        throw error;
      }
      const user = await userService.createUser({
        email,
        nickname,
        password,
        image,
      });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: 로그인
 *     tags: [User]
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
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: 로그인 성공 및 토큰 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
userController.post(
  "/login",
  async (
    req: Request<{}, {}, LoginUserDto>,
    res: Response,
    next: NextFunction
  ) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        const error = new Error("모두 필요합니다.") as TError;
        error.code = 422;
        throw error;
      }
      const user = await userService.getUser(email, password);
      const accessToken = userService.createToken(user);
      const refreshToken = userService.createToken(user, "refresh");
      res.json({ accessToken, refreshToken, user });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: 액세스 토큰 재발급
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 새로운 accessToken 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 */
userController.post(
  "/refresh-token",
  auth.verifyRefreshToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.headers.authorization?.split(" ")[1];
      if (!refreshToken) {
        const error = new Error("refresh token이 존재하지 않습니다.") as TError;
        error.code = 422;
        throw error;
      }
      const userId = req.auth?.userId as string;
      const { newAccessToken } = await userService.refreshToken(
        userId,
        refreshToken
      );
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: 내 정보 조회
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userController.get("/me", auth.verifyAccessToken, async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.auth?.userId as string);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default userController;
