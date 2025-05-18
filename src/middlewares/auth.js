import { expressjwt } from "express-jwt";

// 토큰 인증용
const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
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
  // 쿠키에 리프레시 토큰을 담기 때문
  getToken: (req) => req.cookies.refreshToken || null,
});

export default {
  verifyAccessToken,
  verifyRefreshToken,
};
