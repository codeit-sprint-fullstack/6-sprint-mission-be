import { Favorite } from "@prisma/client";
import favoriteRepository from "../repositories/favoriteRepository";

async function likeProduct(
  productId: Favorite["productId"],
  userId: Favorite["userId"]
) {
  return await favoriteRepository.addFavorite(productId, userId);
}

async function unlikeProduct(
  productId: Favorite["productId"],
  userId: Favorite["userId"]
) {
  return await favoriteRepository.removeFavorite(productId, userId);
}

async function checkIsLiked(
  productId: Favorite["productId"],
  userId: Favorite["userId"]
) {
  return await favoriteRepository.isProductLikedByUser(productId, userId);
}

export default {
  likeProduct,
  unlikeProduct,
  checkIsLiked,
};
