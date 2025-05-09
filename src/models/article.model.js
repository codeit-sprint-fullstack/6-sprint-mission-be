// src/models/article.model.js
const { prismaClient } = require("../models/prisma/prismaClient.js");

async function create(data) {
  return prismaClient.article.create({ data });
}

async function findAll() {
  return prismaClient.article.findMany();
}

async function findById(id, include) {
  return prismaClient.article.findUnique({ where: { id }, include });
}

async function update(id, data) {
  return prismaClient.article.update({ where: { id }, data });
}

async function remove(id) {
  return prismaClient.article.delete({ where: { id } });
}

async function like(articleId, userId) {
  return prismaClient.article.update({
    where: { id: articleId },
    data: { likes: { connect: { id: userId } } },
  });
}

async function unlike(articleId, userId) {
  return prismaClient.article.update({
    where: { id: articleId },
    data: { likes: { disconnect: { id: userId } } },
  });
}

module.exports = { create, findAll, findById, update, remove, like, unlike };
