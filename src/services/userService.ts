import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository";
import { User } from "@prisma/client";

const SALT_ROUNDS = 10;

interface RegisterInput {
  email: string;
  nickname: string;
  password: string;
  image?: string | null;
}

interface LoginInput {
  email: string;
  password: string;
}

type SafeUser = Omit<User, "encryptedPassword">;

// 회원가입
async function register({
  email,
  nickname,
  password,
  image,
}: RegisterInput): Promise<SafeUser> {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser)
    throw Object.assign(new Error("이미 존재하는 이메일입니다."), {
      code: 409,
    });

  const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = await userRepository.save({
    email,
    nickname,
    encryptedPassword,
    image: image ?? null, // 이미지 필드 추가
  });

  return filterUser(newUser);
}

// 로그인
async function login({ email, password }: LoginInput): Promise<SafeUser> {
  const user = await userRepository.findByEmail(email);
  if (!user)
    throw Object.assign(new Error("존재하지 않는 이메일입니다."), {
      code: 401,
    });

  const isMatch = await bcrypt.compare(password, user.encryptedPassword);
  if (!isMatch)
    throw Object.assign(new Error("비밀번호가 일치하지 않습니다."), {
      code: 401,
    });

  return filterUser(user);
}

// JWT 토큰 생성
function generateToken(
  user: Pick<User, "id">,
  type: "access" | "refresh" = "access"
): string {
  const payload = { userId: user.id };
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: type === "refresh" ? "14d" : "1h",
  });
}

// 내 정보 조회
async function getUserById(id: number): Promise<SafeUser> {
  const user = await userRepository.findById(id);
  if (!user)
    throw Object.assign(new Error("사용자를 찾을 수 없습니다."), { code: 404 });
  return filterUser(user);
}

// 내 정보 수정
async function updateUser(id: number, data: Partial<User>): Promise<SafeUser> {
  const updated = await userRepository.update(id, data);
  return filterUser(updated);
}

// 비밀번호 변경
async function changePassword(
  id: number,
  currentPassword: string,
  newPassword: string
) {
  // 현재 사용자 정보 조회
  const user = await userRepository.findById(id);
  if (!user)
    throw Object.assign(new Error("사용자를 찾을 수 없습니다."), { code: 404 });

  const isMatch = await bcrypt.compare(currentPassword, user.encryptedPassword);
  if (!isMatch)
    throw Object.assign(new Error("현재 비밀번호가 일치하지 않습니다."), {
      code: 400,
    });

  // 새 비밀번호 해싱 및 업데이트
  const encryptedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  const updated = await userRepository.updatePassword(id, encryptedPassword);
  return filterUser(updated);
}

// 비밀번호 등 민감 정보 제거
function filterUser(user: User): SafeUser {
  const { encryptedPassword, ...rest } = user;
  return rest;
}

export default {
  register,
  login,
  generateToken,
  getUserById,
  updateUser,
  changePassword,
};
