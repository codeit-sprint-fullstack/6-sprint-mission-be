import express from "express";
import userService from "../services/userService.js";
import auth from "../middlewares/auth.js";
import { generateAccessToken } from "../middlewares/utils.js";

const userController = express.Router();

//사용자 정보 가져오기
userController.get("/", auth.varifyAccessToken, async (req, res, next) => {
  const userId = req.auth.userId;

  try {
    const user = await userService.getById(userId);

    const accessToken = generateAccessToken(user);
    return res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default userController;
