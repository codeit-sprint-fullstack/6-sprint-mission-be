import express from "express";
import prisma from "../db/prisma/client.prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authRouter = express.Router();

authRouter.post("/signUp", async (req, res) => {
  const { email, nickname, password } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "이미 존재하는 사용자" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        nickname,
        encryptedPassword: hashedPassword,
      },
    });

    return res.status(201).json({ id: newUser.id, message: "회원가입 완료" });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "서버 오류." });
  }
});

authRouter.post("/signIn", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user)
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });

    const passwordMatch = await bcrypt.compare(
      password,
      user.encryptedPassword
    );
    if (!passwordMatch)
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });

    const accessToken = jwt.sign({ id: user.id }, "SECRET_KEY", { expiresIn: "1h" });

    res.status(200).json({
      accessToken,
      user: {
        nickname: user.nickname,
      },
      message: "로그인에 성공",
    });
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

export default authRouter;
