import productRepository from "../repositories/productRepository.js";

async function getById(id) {
  return await productRepository.getById(id);
}

async function create(product) {
  return await productRepository.save(product);
}

async function getAll() {
  return await productRepository.getAll();
}
export default {
  getById,
  create,
  getAll,
};
