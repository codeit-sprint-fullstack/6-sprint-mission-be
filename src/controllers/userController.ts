import express, { NextFunction, Response, Request } from "express";
import userService from "../services/userService.js";
import auth from "../middlewares/auth.js";
import { generateAccessToken } from "../middlewares/utils.js";
import { AuthenticationError } from "../types/errors.js";

const userController = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 사용자 정보 관련 API
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: 인증된 사용자 정보 가져오기
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 정보 및 새 access token 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "12345"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     nickname:
 *                       type: string
 *                       example: "PandaKing"
 *       401:
 *         description: 인증 실패 (유효하지 않은 토큰 등)
 */

//사용자 정보 가져오기
userController.get(
  "/",
  auth.verifyAccessToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.auth) throw new AuthenticationError("작성자가 아닙니다");
    const userId = req.auth.userId;

    try {
      const user = await userService.getById(userId);

      const accessToken = generateAccessToken(user);
      res.json({
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default userController;
