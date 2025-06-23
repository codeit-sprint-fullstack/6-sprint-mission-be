import { User } from "@prisma/client";
import prisma from "../config/prisma";

async function findById(id: User["id"]): Promise<User | null> {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

async function findByEmail(email: User["email"]): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

async function save(
  user: Pick<User, "email" | "nickName" | "password">
): Promise<User> {
  return prisma.user.create({
    data: {
      email: user.email,
      nickName: user.nickName,
      password: user.password,
    },
  });
}

async function update(
  id: User["id"],
  data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
): Promise<User> {
  return prisma.user.update({
    where: {
      id,
    },
    data,
  });
}

// async function createOrUpdate(provider, providerId, email, name) {
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
};
