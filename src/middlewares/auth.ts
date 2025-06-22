import { configDotenv } from "dotenv";
import { Request } from "express";
import { expressjwt } from "express-jwt";
configDotenv();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// 토큰 인증용
const verifyAccessToken = expressjwt({
  secret: JWT_SECRET as string,
  algorithms: ["HS256"],
  credentialsRequired: true, // 새로고침 실패 시 처리 완화를 위해 false로 설정 (개발환경만)
  // send request용
  getToken: (req: Request): string | undefined => {
    const authHeader = req.headers?.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return authHeader.split(" ")[1];
    }
    // return req.cookies?.accessToken; // 쿠키도 fallback
    return undefined;
  },
});

const verifyRefreshToken = expressjwt({
  secret: JWT_SECRET as string,
  algorithms: ["HS256"],
  credentialsRequired: true, // 개발 중 새로고침 시 쿠키 누락 대응
  // 쿠키에 리프레시 토큰을 담기 때문
  getToken: (req: Request): string | undefined => {
    const token = req.cookies?.refreshToken;
    return token || undefined;
  },
});

const auth = {
  verifyAccessToken,
  verifyRefreshToken,
};

export default auth;
