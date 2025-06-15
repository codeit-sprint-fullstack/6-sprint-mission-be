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
exports.signin = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_js_1 = __importDefault(require("../db/prisma/client.js"));
const token_util_js_1 = require("../utils/token.util.js");
const SALT_ROUNDS = 10;
// 회원가입
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, password } = req.body;
        const existingUser = yield client_js_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "이미 사용 중인 이메일입니다." });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, SALT_ROUNDS);
        const user = yield client_js_1.default.user.create({
            data: {
                userName,
                email,
                password: hashedPassword,
            },
        });
        return res.status(201).json({ message: "회원가입 성공", userId: user.id });
    }
    catch (error) {
        console.error("회원가입 오류:", error);
        return res.status(500).json({ message: "서버 오류" });
    }
});
exports.signup = signup;
// 로그인
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield client_js_1.default.user.findUnique({ where: { email } });
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            return res
                .status(401)
                .json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
        }
        const token = (0, token_util_js_1.generateToken)(user);
        return res.status(200).json({
            message: "로그인 성공",
            token,
            nickname: user.userName,
        });
    }
    catch (error) {
        console.error("로그인 오류:", error);
        return res.status(500).json({ message: "서버 오류" });
    }
});
exports.signin = signin;
