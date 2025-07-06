import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service";
import { createToken, refreshAccessToken } from "../utils/token.utils";

// TODO: env 개발용, 배포용 설정
const isProduction = process.env.NODE_ENV === "production";

// 회원가입
export async function signUpController(
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
export async function signInController(
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
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 1000, // 1시간
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: false,
      path: "/auth/refresh-token",
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14일
    });
    res.json({ user });
  } catch (error) {
    next(error);
  }
}

// 토큰 갱신
export async function refreshTokenController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { userId } = req.auth;
    const { newAccessToken, newRefreshToken } = await refreshAccessToken(
      userId,
      refreshToken
    );
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 1000, // 1시간
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/auth/refresh-token",
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14일
    });
    res.json({ message: "refresh token success" });
  } catch (error) {
    next(error);
  }
}

// 유저 정보 조회
export async function getUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.auth;
    const user = await userService.getUserById(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

// 소셜 로그인
export function socialLoginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.auth;
    const accessToken = createToken(userId);
    const refreshToken = createToken(userId, "refresh");
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
    res.redirect(`${redirectUrl}/items`);
  } catch (error) {
    next(error);
  }
}
