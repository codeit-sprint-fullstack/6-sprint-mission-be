// src/models/product.model.js
const { prismaClient } = require("../models/prisma/prismaClient.js");

async function create(data) {
  return prismaClient.product.create({ data });
}

async function findAll() {
  return prismaClient.product.findMany();
}

async function findById(id, include) {
  return prismaClient.product.findUnique({ where: { id }, include });
}

async function update(id, data) {
  return prismaClient.product.update({ where: { id }, data });
}

async function remove(id) {
  return prismaClient.product.delete({ where: { id } });
}

module.exports = { create, findAll, findById, update, remove };
