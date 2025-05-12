import favoriteRepository from "../repositories/favoriteRepository.js";

async function likeProduct(productId, userId) {
  return await favoriteRepository.addFavorite(productId, userId);
}

async function unlikeProduct(productId, userId) {
  return await favoriteRepository.removeFavorite(productId, userId);
}

async function checkIsLiked(productId, userId) {
  return await favoriteRepository.isProductLikedByUser(productId, userId);
}

export default {
  likeProduct,
  unlikeProduct,
  checkIsLiked,
};
