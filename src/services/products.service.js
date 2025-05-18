const productRepository = require("../repositories/products.repository.js");
const prisma = require("../config/prismaClient.js");

async function createProduct(product, userId) {
  return await productRepository.create(product, userId);
}

async function getAll(query) {
  return await productRepository.getAll(query);
}

async function getProduct(id) {
  return await productRepository.getById(id);
}

async function deleteProduct(id) {
  return await productRepository.remove(id);
}

async function updateProduct(id, query, userId) {
  const product = await productRepository.findById(id);
  if (!product) return null;

  if (product.authorId !== userId) return false;

  return await productRepository.update(id, query, userId);
}

// 좋아요 생성
async function createProductLike(userId, productId) {
  if (!userId) {
    const error = new Error("로그인한 사용자만 좋아요를 누를 수 있습니다.");
    error.code = 401;
    throw error;
  }

  // 이미 좋아요가 눌렸다면22 - FE에서 DELETE 잘못 연결했을 때 호출
  const existingLike = await productRepository.findLike(userId, productId);

  if (existingLike) {
    const error = new Error("이미 좋아요를 누른 상태입니다.");
    error.code = 400;
    throw error;
  }

  await productRepository.createLike(userId, productId);
}

// 좋아요 삭제
async function deleteProductLike(userId, productId) {
  if (!userId) {
    const error = new Error("로그인한 사용자만 좋아요를 누를 수 있습니다.");
    error.code = 401;
    throw error;
  }

  const existingLike = await productRepository.findLike(userId, productId);

  if (!existingLike) {
    const error = new Error("좋아요를 누른 적이 없습니다.");
    error.code = 404;
    throw error;
  }

  await productRepository.deleteLike(userId, productId);
}

const productService = {
  createProduct,
  getAll,
  getProduct,
  deleteProduct,
  updateProduct,
  createProductLike,
  deleteProductLike,
};

module.exports = productService;
