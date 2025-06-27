import { RequestHandler } from "express";
import * as authService from "../services/auth.service";
import { SignInDTO, SignUpDTO } from "../dtos/auth.dto";

// 회원가입
export const signUp: RequestHandler = async (req, res): Promise<void> => {
  const { email, nickname, password } = req.body as SignUpDTO;

  try {
    const user = await authService.signUp(email, nickname, password);
    res.status(201).json({ id: user.id, message: "회원가입이 완료되었습니다." });
  } catch (err: any) {
    console.error("회원가입 실패:", err);
    if (err.message === "INVALID") {
      res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
      return;
    }
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 로그인
export const signIn: RequestHandler = async (req, res): Promise<void> => {
  const { email, password } = req.body as SignInDTO;

  try {
    const result = await authService.signIn(email, password);
    res.status(200).json({
      accessToken: result.accessToken,
      user: { nickname: result.nickname },
      message: "로그인에 성공했습니다.",
    });
  } catch (err: any) {
    if (err.message === "INVALID") {
      res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
      return;
    }
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};