import { expressjwt } from "express-jwt";
import dotenv from "dotenv";
import { Request } from "express";

// ESM 환경에선 dotenv.config()가 실행되기 전에 import되면 환경 변수가 적용되지 않을 수 있음 - 타이밍 문제
// ESM은 import 순서에 따라 실행되므로, dotenv는 사용하는 파일에서 직접 호출하는 것이 안전함

dotenv.config();

// 필수로 AccessToken을 검증할때 사용
const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET!,
  algorithms: ["HS256"],
  getToken: (req: Request) => {
    const authHeader = req.headers.authorization;
    return authHeader || undefined;
  },
});

// ✅ expressjwt 자체를 wrap 해서 에러를 무시
export const verifyOptionalAuth = expressjwt({
  secret: process.env.JWT_SECRET!,
  algorithms: ["HS256"],
  credentialsRequired: false, // ✅ 핵심 옵션! 없으면 에러 안 던짐
  getToken: (req: Request) => {
    const authHeader = req.headers.authorization;
    return authHeader || undefined;
  },
});

// 리프레쉬 토큰이 필수일때 사용
const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET!,
  algorithms: ["HS256"],
  getToken: (req: Request) => {
    const authHeader = req.headers.authorization;
    return authHeader || undefined;
  },
});

export default {
  verifyRefreshToken,
  verifyOptionalAuth,
  verifyAccessToken,
};
