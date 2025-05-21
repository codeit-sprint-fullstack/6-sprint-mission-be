import prisma from "../config/prisma.js";

async function findById(id) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

async function findByEmail(email) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

async function findByNickname(nickname) {
  return await prisma.user.findUnique({
    where: {
      nickname,
    },
  });
}

async function save(user, hashedPassword) {
  return prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      hashedPassword,
    },
  });
}

async function update(id, data) {
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
