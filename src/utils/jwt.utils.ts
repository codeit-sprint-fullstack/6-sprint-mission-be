import jwt, { SignOptions } from "jsonwebtoken";
import { JwtPayload } from "../Types/user";

export const generateAccessToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");

  const options: SignOptions = {
    expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN ||
      "1h") as SignOptions["expiresIn"],
  };

  return jwt.sign({ userId }, process.env.JWT_SECRET, options);
};

export const generateRefreshToken = (userId: string): string => {
  if (!process.env.JWT_SECRET_REFRESH)
    throw new Error("JWT_SECRET_REFRESH is not defined");

  const options: SignOptions = {
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN ||
      "7d") as SignOptions["expiresIn"],
  };

  return jwt.sign({ userId }, process.env.JWT_SECRET_REFRESH, options);
};

export const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
