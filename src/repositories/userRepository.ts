import prisma from "../db/prisma/client";
import {
  UserRepository,
  CreateUserInput,
  UpdateUserInput,
} from "../types/index";
import { User } from "@prisma/client";

/**
 * ID로 사용자 조회
 */
async function findById(id: number): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      id: parseInt(id.toString(), 10),
    },
  });
}

/**
 * 이메일로 사용자 조회
 */
async function findByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

/**
 * 회원가입 (비밀번호는 bcrypt로 암호화된 상태여야 함)
 */
async function createdUser(user: CreateUserInput): Promise<User> {
  return await prisma.user.create({
    data: {
      email: user.email,
      name: user.name,
      password: user.password, // 암호화된 비밀번호
      profileImageUrl: user.profileImageUrl ?? null,
    },
  });
}

/**
 * 사용자 정보 업데이트
 */
async function updateUser(id: number, data: UpdateUserInput): Promise<User> {
  return await prisma.user.update({
    where: {
      id: parseInt(id.toString(), 10),
    },
    data,
  });
}

const userRepository: UserRepository = {
  findById,
  findByEmail,
  createdUser,
  updateUser,
};

export default userRepository;
