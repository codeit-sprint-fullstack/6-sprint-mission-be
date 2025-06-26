import express from "express";
import userController from "../controllers/userController";
import auth from "../middlewares/users/auth";
import authErrorHandler from "../middlewares/errors/authErrorHandler";
import upload from "../middlewares/common/upload";

const usersRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: 에러 메시지
 *           example: 인증에 실패했습니다. 다시 로그인해주세요.
 *     ErrorWithData:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: 에러 메시지
 *           example: User already exists
 *         data:
 *           type: object
 *           description: 추가 에러 데이터
 *           example: { "email": "test@example.com" }
 *   responses:
 *     UnauthorizedError:
 *       description: 인증 실패
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     ForbiddenError:
 *       description: 권한 없음
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     NotFoundError:
 *       description: 리소스를 찾을 수 없음
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     ValidationError:
 *       description: 중복 데이터 또는 유효성 검사 실패
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorWithData'
 *   securitySchemes:
 *     accessToken:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *
 * security:
 *   - accessToken: []
 *
 * tags:
 *   name: User
 *   description: 사용자 관련 API
 */

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: 현재 로그인한 유저 정보 조회
 *     tags: [User]
 *     security:
 *       - accessToken: []
 *     responses:
 *       200:
 *         description: 유저 정보 조회 성공
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
 *                     email:
 *                       type: string
 *                     nickname:
 *                       type: string
 *                     image:
 *                       type: string
 *                       nullable: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
usersRouter.get("/me", auth.verifyAccessToken, userController.getProfile);

/**
 * @swagger
 * /user/me:
 *   patch:
 *     summary: 유저 정보 수정
 *     tags: [User]
 *     security:
 *       - accessToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile:
 *                 type: string
 *                 format: binary
 *               nickname:
 *                 type: string
 *     responses:
 *       200:
 *         description: 유저 정보 수정 완료
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
 *                     email:
 *                       type: string
 *                     nickname:
 *                       type: string
 *                     image:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: 유효하지 않은 요청 데이터
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
usersRouter.patch(
  "/me",
  auth.verifyAccessToken,
  upload.single("profile"),
  userController.updateUser
);

/**
 * @swagger
 * /user/me/password:
 *   patch:
 *     summary: 비밀번호 변경
 *     tags: [User]
 *     security:
 *       - accessToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: 현재 비밀번호
 *               newPassword:
 *                 type: string
 *                 description: 새 비밀번호
 *     responses:
 *       200:
 *         description: 비밀번호 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 비밀번호가 성공적으로 변경되었습니다.
 *       400:
 *         description: 잘못된 요청 데이터
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
usersRouter.patch(
  "/me/password",
  auth.verifyAccessToken,
  userController.changePassword
);

/**
 * 인증 관련 에러를 처리하는 미들웨어
 * 이 미들웨어는 라우터의 맨 마지막에 위치하여 이전 핸들러에서 발생한 인증 관련 에러를 처리합니다.
 * next()로 전달된 에러가 code 속성이 401 또는 403인 경우 또는 name이 'UnauthorizedError'인 경우
 * 적절한 HTTP 상태 코드와 메시지로 응답합니다.
 */
usersRouter.use(authErrorHandler);

export default usersRouter;
