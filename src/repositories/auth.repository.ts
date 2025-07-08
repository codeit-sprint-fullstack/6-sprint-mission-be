import prisma from "../db/prisma/client.prisma";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const createUser = async (
  email: string,
  nickname: string,
  encryptedPassword: string
) => {
  return prisma.user.create({
    data: {
      email,
      nickname,
      encryptedPassword,
    },
  });
};
