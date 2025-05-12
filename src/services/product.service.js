// src/services/product.service.js
const { product } = require("../repositories/prisma/prismaClient.js");
const productRepository = require("../repositories/product.repository.js");

async function createProduct(productData, userId) {
  const newProduct = await productRepository.create(productData, userId);
  return newProduct;
}

async function getAllProducts() {
  const products = await productRepository.getAll();
  return products;
}

async function getProductById(productId) {
  const product = await productRepository.getById(productId);
  return product;
}

async function updateProduct(productId, updateData) {
  const updatedProduct = await productRepository.update(productId, updateData);
  return updatedProduct;
}

async function deleteProductById(productId) {
  const deletedProduct = await productRepository.deleteById(productId);
  return deletedProduct;
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProductById,
};
