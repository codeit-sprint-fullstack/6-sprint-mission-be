// src/services/product.service.js
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

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
};
