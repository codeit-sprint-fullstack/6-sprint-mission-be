import express from "express";
import userService from "../services/userService.js";
import auth from "../middlewares/auth.js";

const userController = express.Router();

/** 
 * 유저 확인
 */
userController.get("/me", auth.verifyAccessToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await userService.getMe(userId);

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

/**
 * 회원가입
 */
userController.post("/users", async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      const error = new Error("email, name, password가 모두 필요합니다.");
      error.code = 422;
      throw error;
    }

    const user = await userService.createUser({ email, name, password });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * 로그인 (JWT + RefreshToken 쿠키 저장)
 */
userController.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      const error = new Error("email, password가 모두 필요합니다.");
      error.code = 422;
      throw error;
    }

    const user = await userService.getUser(email, password);
    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, "refresh");

    await userService.updateUser(user.id, { refreshToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.json({ ...user, accessToken });
  } catch (error) {
    next(error);
  }
});

/**
 * 액세스 토큰 재발급
 */
userController.post(
  "/token/refresh",
  auth.verifyRefreshToken,
  async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      const { userId } = req.auth;

      const { newAccessToken, newRefreshToken } =
        await userService.refreshToken(userId, refreshToken);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/token/refresh",
      });

      res.json({ accessToken: newAccessToken });
    } catch (error) {
      next(error);
    }
  }
);

export default userController;
