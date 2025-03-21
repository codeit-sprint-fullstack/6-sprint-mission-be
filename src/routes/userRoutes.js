import express from "express";
import prisma from "../db/prisma/client.prisma.js";

const userRouter = express.Router();

// 회원가입
userRouter.post("/signup", async (req, res, next) => {
  try {
    const { email, password, nickname } = req.body;

    const user = await prisma.user.create({
      data: { email, encryptedPassword: password, nickname },
    });

    res.status(201).json(user);
  } catch (e) {
    next(e);
  }
});

// 로그인
userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email, encryptedPassword: password },
      });
      if (!user) throw new Error("존재하지 않는 사용자입니다.");

      const token = { accessToken: `@${user.id}@` };

      res.status(200).json(token);
    });
  } catch (e) {
    next(e);
  }
});

export default userRouter;
