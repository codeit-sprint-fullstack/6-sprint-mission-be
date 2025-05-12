import productRepository from "../repositories/productRepository.js";

/**
 * 상품 등록
 */
async function create(product) {
  return await productRepository.createProduct(product);
}

/**
 * 상품 ID로 조회
 */
async function getById(id) {
  return await productRepository.getById(id);
}

/**
 * 상품 전체 조회
 */
async function getAll() {
  return await productRepository.getAll();
}

/**
 * 상품 수정
 */
async function updateById(id, product) {
  return await productRepository.updateById(id, product);
}

/**
 * 상품 삭제
 */
async function deleteById(id) {
  return await productRepository.deleteById(id);
}

/**
 * 상품 좋아요 추가
 */
async function addLike(userId, productId) {
  return await productRepository.addLike(userId, productId);
}

/**
 * 상품 좋아요 취소
 */
async function removeLike(userId, productId) {
  return await productRepository.removeLike(userId, productId);
}

/**
 * 유저가 상품에 좋아요 눌렀는지 확인
 */
async function hasUserLiked(userId, productId) {
  return await productRepository.hasUserLiked(userId, productId);
}

export default {
  create,
  getById,
  getAll,
  updateById,
  deleteById,
  addLike,
  removeLike,
  hasUserLiked,
};
