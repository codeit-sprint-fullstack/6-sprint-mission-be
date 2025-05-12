import productRepository from "../repositories/productRepository.js";

async function create(product) {
  return await productRepository.save(product);
}

async function getById(id) {
  return await productRepository.getById(id);
}

async function getAll(options) {
  return productRepository.getAll(options);
}

async function update(id, data) {
  return productRepository.update(id, data);
}

async function deleteById(id) {
  return productRepository.deleteById(id);
}

async function createProductComment(comment) {
  return await productRepository.saveProductComment(comment);
}

async function getAllProductComment(id) {
  return await productRepository.getAllProductComment(id);
}

export default {
  create,
  getById,
  getAll,
  update,
  deleteById,
  createProductComment,
  getAllProductComment,
};
