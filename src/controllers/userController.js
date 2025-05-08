import express from "express";
import userService from "../services/userService.js";

// express 라우터 적용
const userController = express.Router();

/**
 * 회원가입
 */
userController.post("/users", async (req, res, next) => {
  try {
    const { email, nickName, password } = req.body;
    if (!email || !nickName || !password) {
      const error = new Error("필수 입력사항입니다.");
      error.code = 422;
      throw error;
    }
    const user = await userService.createdUser({ email, nickName, password });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

export default userController;
