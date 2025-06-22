import { User } from "@prisma/client";
import userRepository from "../repositories/userRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ServerError, ValidationError } from "../types/errors";

/**
 * 비밀번호 해싱
 */
function hashPassword(password: NonNullable<User["password"]>) {
  return bcrypt.hash(password, 10);
}

/**
 * 민감한 유저 정보 제거
 */
function filterSensitiveUserData(user: User) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

/**
 * 비밀번호 검증
 */
async function verifyPassword(
  inputPassword: NonNullable<User["password"]>,
  hashedPassword: NonNullable<User["password"]>
) {
  const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
  if (!isMatch) {
    const error = new ValidationError("비밀번호가 일치하지 않습니다.");
    throw error;
  }
}

/**
 * 유저 확인
 */
async function getMe(userId: NonNullable<User["id"]>) {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new ValidationError("사용자를 찾을 수 없습니다.");
    throw error;
  }

  return filterSensitiveUserData(user);
}

/**
 * 회원가입
 */
async function createUser(user: Pick<User, "email" | "name" | "password">) {
  try {
    const existedUser = await userRepository.findByEmail(user.email);
    if (existedUser) {
      const error = new ValidationError("이미 존재하는 이메일입니다.");
      error.data = { email: user.email };
      throw error;
    }

    const hashedPassword = await hashPassword(user.password as string);
    const createdUser = await userRepository.createdUser({
      ...user,
      password: hashedPassword,
    });

    return filterSensitiveUserData(createdUser);
  } catch (error) {
    if (ValidationError) throw error;

    const customError = new ServerError(
      "회원가입 처리 중 오류가 발생했습니다."
    );
    throw customError;
  }
}

/**
 * 로그인
 */
async function getUser(
  email: NonNullable<User["email"]>,
  password: NonNullable<User["password"]>
) {
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new ValidationError("존재하지 않는 이메일입니다.");
      throw error;
    }

    await verifyPassword(password, user.password as string);
    return { ...filterSensitiveUserData(user), id: user.id };
  } catch (error) {
    if (ValidationError) throw error;

    const customError = new ServerError("로그인 처리 중 오류가 발생했습니다.");
    throw customError;
  }
}

/**
 * JWT 토큰 생성
 */
function createToken(
  user: Omit<User, "password" | "refreshToken">,
  type = "access"
) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  const secret =
    type === "refresh"
      ? process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!
      : process.env.JWT_SECRET!;

  const expiresIn = type === "refresh" ? "14d" : "1h";

  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * 사용자 정보 업데이트
 */
async function updateUser(
  id: User["id"],
  data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
) {
  const updatedUser = await userRepository.updateUser(id, data);
  return filterSensitiveUserData(updatedUser);
}

/**
 * 리프레시 토큰 검증 및 재발급
 */
async function refreshToken(
  userId: User["id"],
  refreshToken: NonNullable<User["refreshToken"]>
) {
  const user = await userRepository.findById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    const error = new ValidationError("인증되지 않았습니다.");
    throw error;
  }

  const newAccessToken = createToken(user, "access");
  const newRefreshToken = createToken(user, "refresh");

  return { newAccessToken, newRefreshToken };
}

export default {
  createUser,
  getUser,
  getMe,
  createToken,
  updateUser,
  refreshToken,
};
