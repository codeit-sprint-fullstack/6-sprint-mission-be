import { User } from "@prisma/client";
import prisma from "../configs/prisma.config";

async function findById(id: User["id"]) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

async function findByEmail(email: User["email"]) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

async function findByNickname(nickname: User["nickname"]) {
  return await prisma.user.findUnique({
    where: {
      nickname,
    },
  });
}

async function save(
  data: Pick<User, "email" | "nickname"> &
    Partial<
      Pick<User, "provider" | "providerId" | "refreshToken" | "hashedPassword">
    >
) {
  return prisma.user.create({
    data,
  });
}

async function update(
  id: User["id"],
  data: Partial<
    Pick<User, "nickname" | "provider" | "providerId" | "refreshToken">
  >
) {
  return prisma.user.update({
    where: {
      id,
    },
    data: data,
  });
}

export default {
  findById,
  findByEmail,
  findByNickname,
  save,
  update,
};
