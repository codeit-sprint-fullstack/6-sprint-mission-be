"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userService_1 = __importDefault(require("../services/userService"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const utils_1 = require("../middlewares/utils");
const errors_1 = require("../types/errors");
const user_dto_1 = require("../dto/user.dto");
const userController = express_1.default.Router();
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
userController.get("/", auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.auth)
            throw new errors_1.AuthenticationError("작성자가 아닙니다");
        const user = yield userService_1.default.getById(req.auth.userId);
        const responsePayload = {
            accessToken: (0, utils_1.generateAccessToken)(user),
            user: {
                id: user.id,
                email: user.email,
                nickname: user.nickname,
            },
        };
        const parsed = user_dto_1.UserWithTokenSchema.safeParse(responsePayload);
        if (!parsed.success) {
            res.status(500).json({
                error: "Internal response structure invalid",
                detail: parsed.error,
            });
            return;
        }
        res.status(200).json(responsePayload);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = userController;
//# sourceMappingURL=userController.js.map