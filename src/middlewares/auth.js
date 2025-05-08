import { expressjwt } from "express-jwt";

const varifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

export default {
  varifyAccessToken,
};
