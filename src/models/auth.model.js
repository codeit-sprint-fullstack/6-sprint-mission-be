// src/models/user.model.js (기존 파일에 추가하는 경우)
const { prismaClient } = require("../models/prisma/prismaClient.js");
const bcrypt = require("bcrypt");

async function create(userData) {
  userData.password = await bcrypt.hash(userData.password, 10);
  return prismaClient.user.create({ data: userData });
}

async function findByEmail(email) {
  return prismaClient.user.findUnique({ where: { email } });
}

// 필요에 따라 refreshToken 저장 및 조회 관련 함수 추가

module.exports = {
  findById,
  update,
  findProductsByUserId,
  create,
  findByEmail /*, refreshToken 관련 함수 */,
};
