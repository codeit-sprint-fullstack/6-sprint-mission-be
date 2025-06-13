import express from "express";
import authController from "../controllers/authController";
import auth from "../middlewares/users/auth";
import authErrorHandler from "../middlewares/errors/authErrorHandler";

const authRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 인증 관련 API
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
 *                 example: test@test.com
 *               password:
 *                 type: string
 *                 example: yourPassword123
 *     responses:
 *       200:
 *         description: 로그인 성공 시 사용자 정보와 액세스 토큰 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: cmagdgpio0000upao3nnzc1mo
 *                     email:
 *                       type: string
 *                       example: test@test.com
 *                     nickname:
 *                       type: string
 *                       example: 홍길동
 *                     image:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-05-09T05:45:06.864Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-05-11T12:45:01.613Z
 *                 accessToken:
 *                   type: string
 *                   description: JWT 액세스 토큰
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: 인증 실패 (존재하지 않는 이메일, 잘못된 비밀번호)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 존재하지 않는 이메일입니다.
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authRouter.post("/signIn", authController.signIn);

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
 *                 example: test123@test.com
 *               password:
 *                 type: string
 *                 example: yourSecurePassword!
 *               nickname:
 *                 type: string
 *                 example: 홍길동
 *     responses:
 *       201:
 *         description: 회원가입 성공 시 생성된 유저 데이터 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 signUpUserData:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: cmajnvff10000upyoxesn9nrs
 *                     email:
 *                       type: string
 *                       example: test123@test.com
 *                     nickname:
 *                       type: string
 *                       example: 홍길동
 *                     image:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-05-11T12:59:48.301Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-05-11T12:59:48.301Z
 *       400:
 *         description: 유효하지 않은 요청 데이터
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         description: 이미 존재하는 사용자
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorWithData'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authRouter.post("/signUp", authController.signUp);

/**
 * @swagger
 * /auth/token/refresh:
 *   post:
 *     summary: 액세스 토큰 재발급
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 토큰 재발급 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: 새로 발급된 JWT 액세스 토큰
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 newRefreshToken:
 *                   type: string
 *                   description: 새로 발급된 리프레시 토큰 (필요한 경우에만 발급)
 *                   nullable: true
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: 인증 실패 (유효하지 않은 리프레시 토큰)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authRouter.post(
  "/token/refresh",
  auth.verifyRefreshToken,
  authController.refreshToken
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: 로그아웃
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 로그아웃 되었습니다.
 *       401:
 *         description: 인증되지 않은 사용자
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 인증되지 않은 사용자입니다.
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authRouter.post("/logout", auth.verifyAccessToken, authController.logOut);

/**
 * 인증 관련 에러를 처리하는 미들웨어
 * 이 미들웨어는 라우터의 맨 마지막에 위치하여 이전 핸들러에서 발생한 인증 관련 에러를 처리합니다.
 * next()로 전달된 에러가 code 속성이 401 또는 403인 경우 또는 name이 'UnauthorizedError'인 경우
 * 적절한 HTTP 상태 코드와 메시지로 응답합니다.
 */
authRouter.use(authErrorHandler);

export default authRouter;
