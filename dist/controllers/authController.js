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
const varify_js_1 = __importDefault(require("../middlewares/varify.js"));
const authService_js_1 = __importDefault(require("../services/authService.js"));
const utils_js_1 = require("../middlewares/utils.js");
const errors_js_1 = require("../types/errors.js");
const auth_js_1 = __importDefault(require("../middlewares/auth.js"));
const authController = express_1.default.Router();
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
authController.post("/signUp", varify_js_1.default.signUpRequestStructure, varify_js_1.default.checkExistedEmail, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createUser = yield authService_js_1.default.create(req.body);
        const accessToken = (0, utils_js_1.generateAccessToken)(createUser);
        res.json({
            accessToken,
            user: {
                id: createUser.id,
                email: createUser.email,
                nickname: createUser.nickname,
            },
        });
    }
    catch (error) {
        next(error);
    }
}));
//로그인
authController.post("/signIn", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield authService_js_1.default.getByEmail(req.body);
        if (!user) {
            throw new errors_js_1.NotFoundError("Not Found, 존재하지 않는 사용자입니다.");
        }
        const accessToken = authService_js_1.default.createAccessToken(user);
        const refreshToken = authService_js_1.default.createRefreshToken(user);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, //개발 단계에서는 http를 사용중임
            sameSite: "none",
            maxAge: 14 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        res.json(Object.assign(Object.assign({}, user), { accessToken }));
    }
    catch (error) {
        next(error);
    }
}));
//리프레쉬 토큰 발급
authController.post("/refresh", auth_js_1.default.verifyAccessToken, (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken)
            res.status(401).json({ message: "리프레쉬 토큰이 없습니다." });
        const payload = req.auth;
        if (!payload)
            throw new errors_js_1.AuthenticationError("접근 권한이 없습니다.");
        const user = {
            id: payload.userId,
            email: payload.email,
            nickname: payload.nickname,
        };
        const newAccessToken = (0, utils_js_1.generateAccessToken)(user);
        const newRefreshToken = (0, utils_js_1.generateRefreshToken)(user);
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false, //개발 환경은 http 사용중임
            sameSite: "none",
            maxAge: 14 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        res.json({ accessToken: newAccessToken });
    }
    catch (error) {
        res.status(403).json({ message: "토큰을 찾을 수 없습니다." });
    }
});
authController.post("/logout", (req, res, next) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false, //개발 중에는 http 사용중
            sameSite: "none",
            path: "/",
        });
        res.status(200).json({ message: "로그아웃 완료" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = authController;
//# sourceMappingURL=authController.js.map