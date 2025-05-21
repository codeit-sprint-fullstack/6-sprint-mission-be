import prisma from "../db/prisma.js";

const userRepository = {
  async createUser(email, password, nickname) {
    return prisma.user.create({
      data: {
        email,
        encryptedPassword : password,
        nickname,
      },
    });
  },

  async findUserByEmail(email) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  },

  async findUserBynickname(nickname) {
    return prisma.user.findUnique({
      where: {
        nickname,
      },
    });
  },

  async findUserById(id) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  },

  async saveRefreshToken(userId, refreshToken) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken,
      },
    });
  },

  async findUserByRefreshToken(refreshToken) {
    return prisma.user.findFirst({
      where: {
        refreshToken,
      },
    });
  },

  async clearRefreshToken(refreshToken) {
    return prisma.user.updateMany({
      where: {
        refreshToken,
      },
      data: {
        refreshToken: null,
      },
    });
  },
};

export default userRepository;