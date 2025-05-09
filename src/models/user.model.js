// src/models/user.model.js
const { prismaClient } = require("../models/prisma/prismaClient.js");

async function findById(id) {
  return prismaClient.user.findUnique({ where: { id } });
}

async function update(id, data) {
  return prismaClient.user.update({ where: { id }, data });
}

async function findProductsByUserId(userId) {
  return prismaClient.product.findMany({ where: { userId } });
}

// 찜 목록 관련 (User 모델에 관계 설정 필요)
// async function findFavoritesByUserId(userId) {
//   return prismaClient.user.findUnique({
//   where: { id: userId },
//   include: { favorites: true }, // favorites 관계 포함
//   });
// }

module.exports = {
  findById,
  update,
  findProductsByUserId /*, findFavoritesByUserId */,
};
