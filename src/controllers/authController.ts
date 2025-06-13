import { NextFunction, Request, RequestHandler, Response } from "express";
import authService from "../service/authService";
import userService from "../service/userService";
import { User } from "@prisma/client";

// 로그인
const signIn = async (
  req: Request<{}, {}, { email: User["email"]; password: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await authService.signIn(email, password);
    const accessToken = authService.createToken(user.id, "access");
    const refreshToken = authService.createToken(user.id, "refresh");

    await userService.updateUser(user.id, { refreshToken });

    res.status(201).json({ user, accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

// 로그아웃
const logOut: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.auth!.userId;

    await authService.logout(userId);

    res.status(200).json({ status: 200, message: "로그아웃 되었습니다." });
  } catch (error) {
    next(error);
  }
};

// 회원가입
const signUp = async (
  req: Request<
    {},
    {},
    { nickname: User["nickname"]; email: User["email"]; password: string }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nickname, email, password } = req.body;

    const signUpResult = await userService.createUser({
      nickname,
      email,
      password,
    });
    const refreshToken = authService.createToken(signUpResult.id, "refresh");

    const signUpUserData = await userService.updateUser(signUpResult.id, {
      ...signUpResult,
      refreshToken,
    });

    res.status(201).json({ signUpUserData });
  } catch (error) {
    next(error);
  }
};

// 토큰 재발급
const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.headers.authorization;
    const userId = req.auth!.userId;

    const { accessToken, newRefreshToken } = await authService.refreshUserToken(
      userId,
      refreshToken
    );

    if (newRefreshToken) {
      res.status(201).json({ accessToken, refreshToken: newRefreshToken });
    } else {
      res.json({ accessToken });
    }
  } catch (error) {
    next(error);
  }
};

export default {
  signIn,
  signUp,
  refreshToken,
  logOut,
};
