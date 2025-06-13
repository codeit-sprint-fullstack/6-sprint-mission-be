import favoriteRepository from "../repositories/favoriteRepository.js";
import productRepository from "../repositories/productRepository.js";

async function toggleFavorite(userId, productId) {
  const existing = await favoriteRepository.isFavorite(userId, productId);

  if (existing) {
    await favoriteRepository.removeFavorite(userId, productId);
    await productRepository.decrementFavoriteCount(productId);
  } else {
    await favoriteRepository.addFavorite(userId, productId);
    await productRepository.incrementFavoriteCount(productId);
  }

  // 수정된 상품 정보 product에 전달
  const product = await productRepository.findById(productId, userId);
  const { owner, favorites, ...rest } = product;

  return {
    ...rest,
    ownerNickname: owner?.nickName || "알 수 없음",
    favoriteCount: product.favoriteCount,
    isFavorite: !existing,
  };
}

export default {
  toggleFavorite,
};
