import { expressjwt } from "express-jwt";
import dotenv from "dotenv";
dotenv.config();
// function throwUnauthorizedError() {
//   const error = new Error("Unauthorized");
//   error.code = 401;
//   throw error;
// }

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET!,
  algorithms: ["HS256"],
  requestProperty: "auth", //필요?
});

const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET!,
  algorithms: ["HS256"],
  getToken: (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return undefined;
    return authHeader.split(" ")[1];
  },
});

export default {
  verifyAccessToken,
  verifyRefreshToken,
};
