import express from "express";
import varify from "../middlewares/varify.js";
import authService from "../services/authService.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/utils.js";
import jwt from "jsonwebtoken";

const authController = express.Router();

//회원가입
authController.post(
  "/signUp",
  varify.signUpRequestStructure,
  varify.checkExistedEmail,
  async (req, res, next) => {
    try {
      const createUser = await authService.create(req.body);

      const accessToken = generateAccessToken(createUser);
      return res.json({
        accessToken,
        user: {
          id: createUser.id,
          email: createUser.email,
          nickname: createUser.nickname,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

//로그인
authController.post("/signIn", async (req, res, next) => {
  try {
    const user = await authService.getByEmail(req.body);

    if (!user) {
      const error = new Error("Not Found, 존재하지 않는 사용자입니다.");
      error.code = 404;
      throw error;
    }

    const accessToken = authService.createAccessToken(user);
    const refreshToken = authService.createRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, //개발 단계에서는 http를 사용중임
      sameSite: "Lax",
      maxAge: 14 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({ ...user, accessToken });
  } catch (error) {
    next(error);
  }
});

//리프레쉬 토큰 발급
authController.post("/refresh", (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "리프레쉬 토큰이 없습니다." });

    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );

    const user = {
      id: payload.userId,
      email: payload.email,
      nickname: payload.nickname,
    };

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false, //개발 환경은 http 사용중임
      sameSite: "Lax",
      maxAge: 14 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: "토큰을 찾을 수 없습니다." });
  }
});

authController.post("/logout", (req, res, next) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, //개발 중에는 http 사용중
      sameSite: "Lax",
      path: "/",
    });
    return res.status(200).json({ message: "로그아웃 완료" });
  } catch (error) {
    next(err);
  }
});

export default authController;
