import { User } from "@prisma/client";
import { prisma } from "../db/prisma/client.prisma";

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

async function save(user: {
  nickname: User["nickname"];
  email: User["email"];
  encryptedPassword: User["encryptedPassword"];
}) {
  return prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      encryptedPassword: user.encryptedPassword,
    },
  });
}

async function update(
  id: User["id"],
  data: {
    nickname?: User["nickname"];
    email?: User["email"];
    encryptedPassword?: User["encryptedPassword"];
    refreshToken?: User["refreshToken"];
  }
) {
  return prisma.user.update({
    where: {
      id,
    },
    data: data,
  });
}

// async function createOrUpdate(
//   provider: string,
//   providerId: string,
//   email: string,
//   name: string
// ) {
//   return prisma.user.upsert({
//     where: { provider, providerId },
//     update: { email, name },
//     create: { provider, providerId, email, name },
//   });
// }

export default {
  findById,
  findByEmail,
  save,
  update,
  // createOrUpdate,
};
