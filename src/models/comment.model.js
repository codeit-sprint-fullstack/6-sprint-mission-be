// src/models/comment.model.js
const { prismaClient } = require("../models/prisma/prismaClient.js");

async function create(data) {
  return prismaClient.comment.create({ data });
}

async function findManyByProductId(productId, include) {
  return prismaClient.comment.findMany({
    where: { productId },
    include,
  });
}

async function findManyByArticleId(articleId, include) {
  return prismaClient.comment.findMany({
    where: { articleId },
    include,
  });
}

async function findById(id) {
  return prismaClient.comment.findUnique({ where: { id } });
}

async function update(id, data) {
  return prismaClient.comment.update({ where: { id }, data });
}

async function remove(id) {
  return prismaClient.comment.delete({ where: { id } });
}

module.exports = {
  create,
  findManyByProductId,
  findManyByArticleId,
  findById,
  update,
  remove,
};
