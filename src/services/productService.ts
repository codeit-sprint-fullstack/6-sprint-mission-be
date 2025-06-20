import { Product } from "@prisma/client";
import productRepository from "../repositories/productRepository.js";

async function getById(id: Product["id"]) {
  return await productRepository.getById(id);
}

async function create(product: Product) {
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
