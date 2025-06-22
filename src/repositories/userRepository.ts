import prisma from "../config/prisma";
import { Prisma, User } from "@prisma/client";

async function findById(id: number): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}

async function findByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

async function save(user: {
  email: string;
  nickname: string;
  encryptedPassword: string;
  image?: string | null;
}): Promise<User> {
  return prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      encryptedPassword: user.encryptedPassword,
      image: user.image ?? null, // 이미지 필드 추가
    },
  });
}

async function update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
  return prisma.user.update({
    where: { id },
    data,
  });
}

async function updatePassword(
  id: number,
  encryptedPassword: string
): Promise<User> {
  return prisma.user.update({
    where: { id },
    data: { encryptedPassword },
  });
}

export default {
  findById,
  findByEmail,
  save,
  update,
  updatePassword,
};
