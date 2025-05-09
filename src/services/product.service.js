// src/services/product.service.js
const productModel = require("../models/product.model.js");

async function createProduct(productData) {
  // 추가적인 유효성 검사 또는 비즈니스 로직 처리 가능
  return productModel.create(productData);
}

async function getAllProducts() {
  return productModel.findAll();
}

async function getProductById(productId, include) {
  const product = await productModel.findById(parseInt(productId), include);
  if (!product) {
    throw new Error("Product not found"); // 또는 사용자 정의 에러 처리
  }
  return product;
}

async function updateProduct(productId, updateData) {
  // 업데이트 전 유효성 검사 또는 권한 확인 로직 추가 가능
  return productModel.update(parseInt(productId), updateData);
}

async function deleteProduct(productId) {
  // 삭제 전 관련 데이터 처리 또는 권한 확인 로직 추가 가능
  return productModel.remove(parseInt(productId));
}

// 찜 목록 관련 로직도 Service 레이어에서 처리하는 것이 좋습니다.
async function addToFavorites(userId, productId) {
  // User 모델과 Product 모델 간의 관계를 업데이트하는 로직
  // (User 모델에 favorites 관계가 설정되어 있어야 함)
  // 예시: await userModel.addFavorite(userId, productId);
  return { message: "Added to favorites" };
}

async function removeFromFavorites(userId, productId) {
  // 찜 목록에서 제거하는 로직
  // 예시: await userModel.removeFavorite(userId, productId);
  return { message: "Removed from favorites" };
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addToFavorites,
  removeFromFavorites,
};
