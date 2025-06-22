import { NextFunction, Request, Response } from "express";
import { expressjwt } from "express-jwt";

function throwUnauthorizedError(): never {
  // 인증되지 않은 경우 401 에러를 발생시키는 함수
  const error = new Error("Unauthorized") as Error & { code?: number };
  error.code = 401;
  throw error;
}

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET as string,
  algorithms: ["HS256"],
  requestProperty: "auth", // 기본값은 req.auth
});

const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET as string,
  algorithms: ["HS256"],
  getToken: (req: Request) => req.cookies.refreshToken,
});

function validateEmailAndPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new Error("email, password 가 모두 필요합니다.") as Error & {
      code?: number;
    };
    error.code = 422;
    throw error;
  }
  next();
}

export { verifyAccessToken, verifyRefreshToken, validateEmailAndPassword };
