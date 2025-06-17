import { Favorite } from "@prisma/client";
import favoriteRepository from "../repositories/favoriteRepository";
import {
  CheckLikedResponseDTO,
  FavoriteIdSchema,
  FavoriteResponseDTO,
} from "../dto/favorite.dto";
import { ValidationError } from "../types/errors";
import { parse } from "path";

async function likeProduct(
  productId: Favorite["productId"],
  userId: Favorite["userId"]
): Promise<FavoriteResponseDTO> {
  const parsed = FavoriteIdSchema.safeParse({ productId, userId });
  if (!parsed.success)
    throw new ValidationError("유효하지 않은 좋아요 요청입니다.");

  await favoriteRepository.addFavorite(productId, userId);

  return { message: "상품 좋아요 완료" };
}

async function unlikeProduct(
  productId: Favorite["productId"],
  userId: Favorite["userId"]
): Promise<FavoriteResponseDTO> {
  const parsed = FavoriteIdSchema.safeParse({ productId, userId });
  if (!parsed.success)
    throw new ValidationError("유효하지 않은 좋아요 취소 요청입니다.");

  await favoriteRepository.removeFavorite(productId, userId);

  return { message: "상품 좋아요 취소 완료" };
}

async function checkIsLiked(
  productId: Favorite["productId"],
  userId: Favorite["userId"]
): Promise<CheckLikedResponseDTO> {
  const parsed = FavoriteIdSchema.safeParse({ productId, userId });
  if (!parsed.success)
    throw new ValidationError("유효하지 않은 좋아요 확인 요청입니다.");

  const isLiked = await favoriteRepository.isProductLikedByUser(
    productId,
    userId
  );

  return { isLiked };
}

export default {
  likeProduct,
  unlikeProduct,
  checkIsLiked,
};
