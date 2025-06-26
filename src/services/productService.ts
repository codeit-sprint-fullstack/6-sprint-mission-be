import { BadRequestError } from "../types/exceptions";
import productRepository from "../repositories/productRepository";
import { Product, User } from "@prisma/client";
import { GetListInput } from "../types";

async function getProducts({
  page = 1,
  pageSize = 10,
  orderBy = "recent",
  keyword,
}: GetListInput) {
  const offset = (page - 1) * pageSize;
  const options = { skip: offset, take: pageSize, orderBy: {}, where: {} };

  if (orderBy === "recent") {
    options.orderBy = { createdAt: "desc" };
  } else if (orderBy === "like") {
    options.orderBy = { likeCount: "desc" };
  }
  if (keyword) {
    options.where = {
      OR: [
        { name: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
      ],
    };
  }
  return productRepository.findAll(options);
}

async function createProduct(
  data: Pick<Product, "images" | "tags" | "price" | "description" | "name">,
  ownerId: Product["ownerId"]
) {
  return productRepository.save(data, ownerId);
}

async function getProduct(productId: Product["id"], userId: User["id"]) {
  return productRepository.findById(productId, userId);
}

async function updateProduct(
  productId: Product["id"],
  data: Pick<Product, "images" | "tags" | "price" | "description" | "name">
) {
  try {
    return await productRepository.update(productId, data);
  } catch (error) {
    throw error;
  }
}

async function deleteProduct(productId: Product["id"]) {
  try {
    return await productRepository.remove(productId);
  } catch (error) {
    throw error;
  }
}

async function likeProduct(productId: Product["id"], userId: User["id"]) {
  try {
    const alreadyLike = await productRepository.findLike(productId, userId);
    if (alreadyLike) {
      throw new BadRequestError("이미 찜한 상품입니다.");
    }
    return await productRepository.createLike(productId, userId);
  } catch (error) {
    throw error;
  }
}

async function unlikeProduct(productId: Product["id"], userId: User["id"]) {
  try {
    const alreadyLike = await productRepository.findLike(productId, userId);
    if (!alreadyLike) {
      throw new BadRequestError("찜하지 않은 상품입니다.");
    }
    return await productRepository.deleteLike(productId, userId);
  } catch (error) {
    throw error;
  }
}

export default {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  likeProduct,
  unlikeProduct,
};
