import prisma from "../config/client.prisma";
import { User } from "@prisma/client";

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

async function save(
  user: Pick<User, "email" | "nickname" | "password" | "image">
) {
  return prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      password: user.password,
      image: user.image,
    },
  });
}

export default {
  findById,
  findByEmail,
  save,
};
