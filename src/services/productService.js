import { PRODUCT_NOT_FOUND } from "../constant.js";
import { BadRequestError, NotFoundError } from "../exceptions.js";
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
  try {
    return await productRepository.update(productId, data);
  } catch (e) {
    if (e.code === "P2025") {
      throw new NotFoundError(PRODUCT_NOT_FOUND);
    }
    throw e;
  }
}

async function deleteProduct(productId) {
  try {
    return await productRepository.remove(productId);
  } catch (e) {
    if (e.code === "P2025") {
      throw new NotFoundError(PRODUCT_NOT_FOUND);
    }
    throw e;
  }
}

async function likeProduct(productId, userId) {
  try {
    const alreadyLike = await productRepository.findLike(productId, userId);
    if (alreadyLike) {
      throw new BadRequestError("이미 찜한 상품입니다.");
    }
    return await productRepository.createLike(productId, userId);
  } catch (e) {
    if (e.code === "P2003") {
      throw new NotFoundError(PRODUCT_NOT_FOUND);
    }
    throw e;
  }
}

async function unlikeProduct(productId, userId) {
  try {
    const alreadyLike = await productRepository.findLike(productId, userId);
    if (!alreadyLike) {
      throw new BadRequestError("찜하지 않은 상품입니다.");
    }
    return await productRepository.deleteLike(productId, userId);
  } catch (e) {
    if (e.code === "P2003") {
      throw new NotFoundError(PRODUCT_NOT_FOUND);
    }
    throw e;
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
