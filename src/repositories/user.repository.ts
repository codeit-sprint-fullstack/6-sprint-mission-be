import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

const userRepository = {
  createUser: async (
    email: string,
    encryptedPassword: string,
    nickname: string
  ): Promise<User> => {
    return prisma.user.create({
      data: {
        email,
        encryptedPassword,
        nickname,
      },
    });
  },

  findUserByEmail: async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  findUserBynickname: async (nickname: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { nickname },
    });
  },

  findUserByRefreshToken: async (
    refreshToken: string
  ): Promise<User | null> => {
    return prisma.user.findFirst({
      where: { refreshToken },
    });
  },

  updateRefreshToken: async (
    userId: string,
    refreshToken: string
  ): Promise<User> => {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  },
};

export default userRepository;
