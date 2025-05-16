import express from "express";
import prisma from "../../prisma/client.prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import auth from "../middlewares/auth.js";

const userRouter = express.Router();

// 비밀번호 제외
function filterPassword(user) {
  const { password, ...data } = user;

  return data;
}

// JWT 토큰 발급
function createToken(user, type = "accessToken") {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: type === "accessToken" ? "30m" : "1day",
  });

  return token;
}

// 회원가입
userRouter.post("/signUp", async (req, res, next) => {
  try {
    const { email, password, nickname } = req.body;

    // 유효성 검사 실패
    if (!email || !password || !nickname) {
      const error = new Error("이메일, 비밀번호, 닉네임을 모두 입력해주세요.");
      error.code = 400;

      throw error;
    }

    const existedUser = await prisma.user.findUnique({
      where: { email },
    });

    // 존재하는 이메일
    if (existedUser) {
      const error = new Error("이미 존재하는 이메일입니다.");
      error.code = 400;

      throw error;
    }

    const existedNickname = await prisma.user.findUnique({
      where: { nickname },
    });

    // 존재하는 닉네임
    if (existedNickname) {
      const error = new Error("이미 존재하는 닉네임입니다.");
      error.code = 400;

      throw error;
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: encryptedPassword, nickname },
    });

    const filterPasswordUser = filterPassword(user);
    const accessToken = createToken(user);
    const refreshToken = createToken(user, "refreshToken");

    res.status(201).json({ ...filterPasswordUser, accessToken, refreshToken });
  } catch (e) {
    next(e);
  }
});

// 로그인
userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 이메일 불일치
    if (!user) {
      const error = new Error("존재하지 않는 이메일입니다.");
      error.code = 400;

      throw error;
    }

    // 비밀번호 불일치
    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      const error = new Error("비밀번호가 일치하지 않습니다.");
      error.code = 400;

      throw error;
    }

    const filterPasswordUser = filterPassword(user);
    const accessToken = createToken(user);
    const refreshToken = createToken(user, "refreshToken");

    res.status(200).json({ ...filterPasswordUser, accessToken, refreshToken });
  } catch (e) {
    next(e);
  }
});

userRouter.post(
  "/refresh-token",
  auth.verifyRefreshToken,
  async (req, res, next) => {
    const userId = req.auth.id;
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        const error = new Error("인증에 실패하였습니다.");
        error.code = 401;

        throw error;
      }

      const accessToken = createToken(user);
      const refreshToken = createToken(user, "refreshToken");

      res.status(200).json({ accessToken, refreshToken });
    } catch (e) {
      next(e);
    }
  }
);

export default userRouter;
