import express from "express";
import userService from "../services/userService.js";
import auth from "../middlewares/auth.js";
import userRepository from "../repositories/userRepository.js";

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

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/token/refresh",
      maxAge: 1000 * 60 * 60 * 24 * 14, // 2주
    });

    res.json({
      id: user.id,
      email: user.email,
      nickName: user.nickName,
      accessToken,
    });
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
        maxAge: 1000 * 60 * 60 * 24 * 14,
      });

      res.json({ accessToken: newAccessToken });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * 유저 로그인 유지
 */
userController.get(
  "/users/me",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const user = await userRepository.findById(req.auth.userId);
      if (!user) {
        return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      }

      const { password, refreshToken, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      next(error);
    }
  }
);

export default userController;
