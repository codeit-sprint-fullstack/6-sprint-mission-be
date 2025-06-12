import { NextFunction, Request, Response } from "express";
import userService from "../services/userService";
import { createToken, refreshAccessToken } from "../utils/authUtils";

// 회원가입
export async function signUp(
  req: Request<{}, {}, { email: string; nickname: string; password: string }>,
  res: Response,
  next: NextFunction
) {
  const { email, nickname, password } = req.body;

  try {
    const user = await userService.createUser(email, nickname, password);
    res.status(201).json({ user: user });
  } catch (error) {
    next(error);
  }
}

// 로그인
export async function signIn(
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;

  try {
    const user = await userService.getUser(email, password);
    const accessToken = createToken(user.id);
    const refreshToken = createToken(user.id, "refresh");

    await userService.updateUser(user.id, { refreshToken });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14일
    });
    res.json({ user, accessToken });
  } catch (error) {
    next(error);
  }
}

// 토큰 갱신
export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { userId } = req.auth;
    const { newAccessToken, newRefreshToken } = await refreshAccessToken(
      Number(userId),
      refreshToken
    );
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/auth/refresh-token",
    });
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
}

// 유저 정보 조회
export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.auth;
    const user = await userService.getUserById(Number(userId));
    console.log(user);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

// 소셜 로그인
export function socialLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.auth;
    const accessToken = createToken(Number(userId));
    const refreshToken = createToken(Number(userId), "refresh");
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/auth/refresh-token",
    });
    const redirectUrl = process.env.FRONTEND_URL;
    res.redirect(`${redirectUrl}/oauth-success`);
  } catch (error) {
    next(error);
  }
}
