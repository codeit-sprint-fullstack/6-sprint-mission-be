var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
import prisma from "../db/prisma/client.js";
import { generateToken } from "../utils/token.util.js";
const SALT_ROUNDS = 10;
// 회원가입
export const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, password } = req.body;
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(409).json({ message: "이미 사용 중인 이메일입니다." });
            return;
        }
        const hashedPassword = yield bcrypt.hash(password, SALT_ROUNDS);
        const user = yield prisma.user.create({
            data: {
                userName,
                email,
                password: hashedPassword,
            },
        });
        res.status(201).json({ message: "회원가입 성공", userId: user.id });
    }
    catch (error) {
        console.error("회원가입 오류:", error);
        res.status(500).json({ message: "서버 오류" });
    }
});
// 로그인
export const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user || !(yield bcrypt.compare(password, user.password))) {
            res.status(401).json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
            return;
        }
        const token = generateToken(user);
        res.status(200).json({
            message: "로그인 성공",
            token,
            nickname: user.userName,
        });
    }
    catch (error) {
        console.error("로그인 오류:", error);
        res.status(500).json({ message: "서버 오류" });
    }
});
