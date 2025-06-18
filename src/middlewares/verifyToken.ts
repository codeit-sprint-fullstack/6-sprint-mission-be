import "dotenv/config";
import { expressjwt } from "express-jwt";

export const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET as string,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.accessToken,
});

export const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET as string,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.refreshToken,
});
