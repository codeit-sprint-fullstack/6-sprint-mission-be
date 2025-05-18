import express from "express";
import userService from "../services/userService.js";
import auth from "../middlewares/auth.js";

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

/**
 * 로그인
 */
userController.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      const error = new Error("email, paswword 가 모두 필요합니다.");
      error.code = 422;
      throw error;
    }
    const user = await userService.getUser(email, password);

    /// 토큰 인증 적용
    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, "refresh");
    await userService.updateUser(user.id, { refreshToken });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60, // 1시간
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/token/refresh",
      maxAge: 1000 * 60 * 60 * 24 * 14, // 2주
    });

    res.json({ ...user, accessToken });
  } catch (error) {
    next(error);
  }
});

/**
 * refreshToken 재발급
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
      return res.json({ accessToken: newAccessToken });
    } catch (error) {
      return next(error);
    }
  }
);

export default userController;
