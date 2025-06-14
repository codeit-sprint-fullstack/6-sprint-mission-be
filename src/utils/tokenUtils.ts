import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository";
import { UnauthorizedError } from "../types/exceptions";
import { User } from "@prisma/client";
import { ExceptionMessage } from "../ExceptionMessage";

// 토큰 생성 함수
function createToken(
  userId: User["id"],
  type: "access" | "refresh" = "access"
) {
  const payload = { userId };
  const expiresIn = type === "refresh" ? "14d" : "1h";
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn,
  });
}

// 토큰 갱신 함수
async function refreshAccessToken(
  userId: User["id"],
  refreshToken: User["refreshToken"]
) {
  const user = await userRepository.findById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    throw new UnauthorizedError(ExceptionMessage.UNAUTHORIZED);
  }
  const newAccessToken = createToken(userId);
  const newRefreshToken = createToken(userId, "refresh");
  return { newAccessToken, newRefreshToken };
}

export { createToken, refreshAccessToken };
