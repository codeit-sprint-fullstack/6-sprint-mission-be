import productRepository from "../repositories/productRepository.js";

async function create(product) {
  return await productRepository.save(product);
}

async function getById(id) {
  return await productRepository.getById(id);
}

async function getAll() {
  return productRepository.getAll();
}

async function update(id, data) {
  return productRepository.update(id, data);
}

async function deleteById(id) {
  return productRepository.deleteById(id);
}

export default {
  create,
  getById,
  getAll,
  update,
  deleteById,
};
