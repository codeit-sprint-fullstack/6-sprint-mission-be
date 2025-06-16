import { Product, User, Comment } from "@prisma/client";
import productRepository from "../repositories/productRepository";

async function create(
  product: Omit<Product, "id" | "createdAt" | "updatedAt">
) {
  return await productRepository.save(product);
}

async function getById(productId: Product["id"], userId: User["id"]) {
  const product = await productRepository.getById(productId, userId);

  return product;
}

async function getAll(options: {
  order: "createdAt" | "favorite";
  skip: number;
  take: number;
  keyword: string;
}) {
  return productRepository.getAll(options);
}

async function update(
  id: Product["id"],
  data: Pick<Product, "name" | "description" | "price" | "tags" | "imageUrl">
) {
  return productRepository.update(id, data);
}

async function deleteById(id: Product["id"]) {
  return productRepository.deleteById(id);
}

async function createProductComment(comment: Comment) {
  return await productRepository.saveProductComment(comment);
}

async function getAllProductComment(id: Product["id"]) {
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
