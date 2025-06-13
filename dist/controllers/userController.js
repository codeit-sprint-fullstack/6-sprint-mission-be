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
const userService_js_1 = __importDefault(require("../services/userService.js"));
const auth_js_1 = __importDefault(require("../middlewares/auth.js"));
const utils_js_1 = require("../middlewares/utils.js");
const errors_js_1 = require("../types/errors.js");
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
userController.get("/", auth_js_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.auth)
        throw new errors_js_1.AuthenticationError("작성자가 아닙니다");
    const userId = req.auth.userId;
    try {
        const user = yield userService_js_1.default.getById(userId);
        const accessToken = (0, utils_js_1.generateAccessToken)(user);
        res.json({
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                nickname: user.nickname,
            },
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = userController;
//# sourceMappingURL=userController.js.map