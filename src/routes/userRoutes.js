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

    res.json(user);
  } catch (e) {
    next(e);
  }
});

// 로그인

export default userRouter;
