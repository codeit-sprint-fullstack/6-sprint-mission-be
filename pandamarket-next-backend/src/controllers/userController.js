import auth from "../middlewares/auth.js";
import userService from "../services/userService.js";
import express from "express";

const userController = express.Router();

userController.post("/signup", async (req, res, next) => {
  try {
    const { email, nickname, password, image } = req.body;
    if (!email || !nickname || !password) {
      const error = new Error("모두 필요합니다.");
      error.code = 422;
      throw error;
    }
    const user = await userService.createUser({
      email,
      nickname,
      password,
      image,
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

userController.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      const error = new Error("모두 필요합니다.");
      error.code = 422;
      throw error;
    }
    const user = await userService.getUser(email, password);

    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, "refresh");
    res.json({ accessToken, refreshToken, user });
  } catch (error) {
    next(error);
  }
});

userController.post(
  "/refresh-token",
  auth.verifyRefreshToken,
  async (req, res, next) => {
    try {
      const refreshToken = req.headers.authorization?.split(" ")[1];
      if (!refreshToken) {
        const error = new Error("refresh token이 존재하지 않습니다.");
        error.code = 422;
        throw error;
      }
      const { newAccessToken } = await userService.refreshToken(
        userId,
        refreshToken
      );
      return res.json({ accessToken: newAccessToken });
    } catch (error) {
      next(error);
    }
  }
);

userController.get("/me", auth.verifyAccessToken, async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.auth.userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default userController;
