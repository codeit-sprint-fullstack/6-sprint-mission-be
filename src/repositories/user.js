import { PrismaClient } from "../prismaClient.js"; 

const prisma = new PrismaClient();

export const userRepository = {
  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async findByNickname(nickname) {
    return prisma.user.findUnique({
      where: { nickname },
    });
  },

  async create(userData) {
    return prisma.user.create({
      data: userData,
    });
  },

  // add findById for other features later on
};
