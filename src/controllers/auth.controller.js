import bcrypt from "bcrypt";
import prisma from "../db/prisma/client.js";
import { generateToken } from "../utils/token.util.js";

const SALT_ROUNDS = 10;

// 회원가입
export const signup = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "이미 사용 중인 이메일입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        userName,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "회원가입 성공", userId: user.id });
  } catch (error) {
    console.error("회원가입 오류:", error);
    return res.status(500).json({ message: "서버 오류" });
  }
};

// 로그인
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    const token = generateToken(user); // ✅ JWT 생성

    // ✅ 토큰과 nickname 함께 응답으로 내려줌
    return res.status(200).json({
      message: "로그인 성공",
      token,
      nickname: user.userName,
    });
  } catch (error) {
    console.error("로그인 오류:", error);
    return res.status(500).json({ message: "서버 오류" });
  }
};
