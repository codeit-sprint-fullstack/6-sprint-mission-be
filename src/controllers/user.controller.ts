import { RequestHandler } from "express";
import userService from "../services/user.service";
import { User } from "@prisma/client";
import { AuthenticationError } from "../types/errors";

// 회원가입
const signUp: RequestHandler<
  {},
  {},
  Pick<User, "email" | "password" | "nickname">
> = async (req, res, next) => {
  try {
    const signUp = await userService.signUp(req.body);

    res.status(201).json(signUp);
  } catch (e) {
    next(e);
  }
};

// 로그인
const login: RequestHandler<{}, {}, Pick<User, "email" | "password">> = async (
  req,
  res,
  next
) => {
  try {
    const login = await userService.login(req.body);

    res.status(200).json(login);
  } catch (e) {
    next(e);
  }
};

// 내 정보 불러오기
const getMe: RequestHandler = async (req, res, next) => {
  if (!req.auth) throw new AuthenticationError("유효하지 않은 토큰입니다.");

  const userId = req.auth.id;

  try {
    const user = await userService.getMe(userId);

    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
};

// 액세스 토큰 재발급
const refreshAccessToken: RequestHandler = async (req, res, next) => {
  if (!req.auth) throw new AuthenticationError("유효하지 않은 토큰입니다.");

  const userId = req.auth.id;

  try {
    const token = await userService.refreshAccessToken(userId);

    res.status(200).json(token);
  } catch (e) {
    next(e);
  }
};

export default {
  signUp,
  login,
  getMe,
  refreshAccessToken,
};
