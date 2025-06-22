import type { RequestHandler } from "express";
import userService from "../services/userService";
import { SignUpSchema, SignInSchema } from "../dtos/auth.dto";

// 회원가입 핸들러
export const signUp: RequestHandler = async (req, res, next) => {
  try {
    const result = SignUpSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: "입력값 검증 실패",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const user = await userService.register(result.data);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

// 로그인 핸들러
export const signIn: RequestHandler = async (req, res, next) => {
  try {
    const result = SignInSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: "입력값 검증 실패",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const user = await userService.login(result.data);
    const accessToken = userService.generateToken(user);
    const refreshToken = userService.generateToken(user, "refresh");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.json({ ...user, accessToken });
  } catch (err) {
    next(err);
  }
};
