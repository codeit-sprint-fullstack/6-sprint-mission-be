import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository";
import { UnauthorizedError } from "../types/exceptions";

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
    throw new UnauthorizedError();
  }
  const newAccessToken = createToken(user.id);
  const newRefreshToken = createToken(user.id, "refresh");
  return { newAccessToken, newRefreshToken };
}

// 민감한 정보 필터링 함수
function filterSensitiveUserData(user: User) {
  const { hashedPassword, refreshToken, ...rest } = user;
  return rest;
}

// 비밀번호 해싱 함수
function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

// 비밀번호 검증 함수
async function verifyPassword(
  inputPassword: string,
  hashedPassword: NonNullable<User["hashedPassword"]>
) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

export {
  createToken,
  refreshAccessToken,
  filterSensitiveUserData,
  hashPassword,
  verifyPassword,
};
