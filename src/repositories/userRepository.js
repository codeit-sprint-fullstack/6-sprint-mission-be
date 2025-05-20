import prisma from "../config/prisma.js";

async function findById(id) {
  return prisma.user.findUnique({
    where: { id },
  });
}

async function findByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

async function save(user) {
  return prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      encryptedPassword: user.encryptedPassword,
      image: user.image, // 이미지 필드 추가
    },
  });
}

async function update(id, data) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

async function updatePassword(id, encryptedPassword) {
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
