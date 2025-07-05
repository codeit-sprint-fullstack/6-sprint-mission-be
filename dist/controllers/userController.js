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
const auth_1 = __importDefault(require("../middlewares/auth"));
const userService_1 = __importDefault(require("../services/userService"));
const express_1 = __importDefault(require("express"));
const userController = express_1.default.Router();
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
userController.post("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, nickname, password, image } = req.body;
        if (!email || !nickname || !password) {
            const error = new Error("모두 필요합니다.");
            error.code = 422;
            throw error;
        }
        const user = yield userService_1.default.createUser({
            email,
            nickname,
            password,
            image,
        });
        res.status(201).json(user);
    }
    catch (error) {
        next(error);
    }
}));
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
userController.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            const error = new Error("모두 필요합니다.");
            error.code = 422;
            throw error;
        }
        const user = yield userService_1.default.getUser(email, password);
        const accessToken = userService_1.default.createToken(user);
        const refreshToken = userService_1.default.createToken(user, "refresh");
        res.json({ accessToken, refreshToken, user });
    }
    catch (error) {
        next(error);
    }
}));
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
userController.post("/refresh-token", auth_1.default.verifyRefreshToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const refreshToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!refreshToken) {
            const error = new Error("refresh token이 존재하지 않습니다.");
            error.code = 422;
            throw error;
        }
        const userId = (_b = req.auth) === null || _b === void 0 ? void 0 : _b.userId;
        const { newAccessToken } = yield userService_1.default.refreshToken(userId, refreshToken);
        res.json({ accessToken: newAccessToken });
    }
    catch (error) {
        next(error);
    }
}));
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
userController.get("/me", auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield userService_1.default.getUserById((_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId);
        res.json(user);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = userController;
//# sourceMappingURL=userController.js.map