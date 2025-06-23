import { Favorite } from "@prisma/client";
import favoriteRepository from "../repositories/favoriteRepository";
import productRepository from "../repositories/productRepository";
import { NotFoundError } from "@/types/errors";

async function toggleFavorite(
  userId: Favorite["userId"],
  productId: Favorite["productId"]
): Promise<{
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  favoriteCount: number;
  isFavorite: boolean;
  ownerNickname: string;
}> {
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
  if (!product) throw new NotFoundError("상품을 찾을 수 없습니다.");
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
