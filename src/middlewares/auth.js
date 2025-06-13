import { expressjwt } from "express-jwt";

// 토큰 인증용
const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  credentialsRequired: false, // 새로고침 실패 시 처리 완화를 위해 false로 설정 (개발환경만)
  // send request용
  getToken: (req) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      return req.headers.authorization.split(" ")[1];
    }
    return req.cookies?.accessToken; // 쿠키도 fallback
  },
});

const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  credentialsRequired: false, // 개발 중 새로고침 시 쿠키 누락 대응
  // 쿠키에 리프레시 토큰을 담기 때문
  getToken: (req) => {
    const token = req.cookies?.refreshToken || null;
    console.log("refreshToken from cookie:", token); // 디버깅용
    return token;
  },
});

export default {
  verifyAccessToken,
  verifyRefreshToken,
};
