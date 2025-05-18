const express = require("express");
const userService = require("../services/auth.service.js");

const authController = express.Router();

/**
 * 회원가입
 */
authController.post("/sign-up", async (req, res, next) => {
  try {
    const { email, nickname, password } = req.body;

    if (!email || !nickname || !password) {
      const error = new Error("email, name, password를 모두 적어주세요.");
      error.code = 400;
      throw error;
    }

    const newUser = await userService.createUser({ email, nickname, password });

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

/**
 * 로그인
 */
authController.post("/login", async (req, res, next) => {
  // 1) 요청에서 email, 비번 가져옴
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      const error = new Error("email, password를 모두 적어주세요.");
      error.code = 400;
      throw error;
    }

    // 2) DB에서 가져온 email, 비번을 불러오고 해당 사용자에게 토큰 부여
    const user = await userService.getUser(email, password);
    const accessToken = userService.createToken(user, "access");

    return res.json({ ...user, accessToken });
  } catch (err) {
    next(err);
  }
});

module.exports = authController;
