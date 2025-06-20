import bcrypt from "bcrypt";
import prisma from "../db/prisma/client.js";
import { generateToken } from "../utils/token.util.js";
import { Request, Response } from "express";
import { User } from "@prisma/client";

const SALT_ROUNDS = 10;

// 회원가입
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userName, email, password }: { userName: string; email: string; password: string } = req.body;

    const existingUser: User | null = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: "이미 사용 중인 이메일입니다." });
      return;
    }

    const hashedPassword: string = await bcrypt.hash(password, SALT_ROUNDS);

    const user: User = await prisma.user.create({
      data: {
        userName,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "회원가입 성공", userId: user.id });
  } catch (error) {
    console.error("회원가입 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 로그인
export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    const user: User | null = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
      return;
    }

    const token: string = generateToken(user);

    res.status(200).json({
      message: "로그인 성공",
      token,
      nickname: user.userName,
    });
  } catch (error) {
    console.error("로그인 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};
