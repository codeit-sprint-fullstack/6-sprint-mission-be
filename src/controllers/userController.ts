import express, { NextFunction, Response, Request } from "express";
import userService from "../services/userService";
import auth from "../middlewares/auth";
import { generateAccessToken } from "../middlewares/utils";
import { AuthenticationError } from "../types/errors";
import { UserWithTokenDTO, UserWithTokenSchema } from "../dto/user.dto";

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
    try {
      if (!req.auth) throw new AuthenticationError("작성자가 아닙니다");

      const user = await userService.getById(req.auth.userId);

      const responsePayload: UserWithTokenDTO = {
        accessToken: generateAccessToken(user),
        user: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
        },
      };

      const parsed = UserWithTokenSchema.safeParse(responsePayload);
      if (!parsed.success) {
        res.status(500).json({
          error: "Internal response structure invalid",
          detail: parsed.error,
        });
        return;
      }

      res.status(200).json(responsePayload);
    } catch (error) {
      next(error);
    }
  }
);

export default userController;
