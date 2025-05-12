// src/repositories/product.repository.js
const prismaClient = require("../repositories/prisma/prismaClient.js");

async function create(productData, userId) {
  const newProduct = await prismaClient.product.create({
    data: { ...productData, userId },
  });
  return newProduct;
}

async function getAll() {
  const products = await prismaClient.product.findMany();
  return products;
}

async function getById(productId) {
  const product = await prismaClient.product.findUnique({
    where: { id: productId },
  });
  return product;
}

module.exports = {
  create,
  getAll,
  getById,
};
