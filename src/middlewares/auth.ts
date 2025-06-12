import "dotenv/config";

import { expressjwt } from "express-jwt";

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET as string,
  algorithms: ["HS256"],
});

const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET as string,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.refreshToken,
});

export default {
  verifyAccessToken,
  verifyRefreshToken,
};
