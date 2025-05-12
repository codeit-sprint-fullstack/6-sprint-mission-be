import { BadRequestError } from "../exceptions.js";
import productRepository from "../repositories/productRepository.js";

async function getProducts({
  page = 1,
  pageSize = 10,
  orderBy = "recent",
  keyword,
}) {
  const offset = (page - 1) * pageSize;
  const options = { skip: offset, take: pageSize, orderBy: {}, where: {} };

  if (orderBy === "recent") {
    options.orderBy = { createdAt: "desc" };
  } else if (orderBy === "favorite") {
    options.orderBy = { favoriteCount: "desc" };
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

async function createProduct(data, ownerId) {
  return productRepository.save(data, ownerId);
}

async function getProduct(productId, userId) {
  return productRepository.findById(productId, userId);
}

async function updateProduct(productId, data) {
  return productRepository.update(productId, data);
}

async function deleteProduct(productId) {
  return productRepository.remove(productId);
}

async function likeProduct(productId, userId) {
  const alreadyLike = await productRepository.findLike(productId, userId);
  if (alreadyLike) {
    throw new BadRequestError("이미 찜한 상품입니다.");
  }
  return productRepository.createLike(productId, userId);
}

async function unlikeProduct(productId, userId) {
  const alreadyLike = await productRepository.findLike(productId, userId);
  if (!alreadyLike) {
    throw new BadRequestError("찜하지 않은 상품입니다.");
  }
  return productRepository.deleteLike(productId, userId);
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
