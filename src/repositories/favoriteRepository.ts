import { Favorite } from "@prisma/client";
import prisma from "../config/client.prisma.js";

async function addFavorite(
  productId: Favorite["productId"],
  userId: Favorite["userId"]
) {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    const product = await tx.product.findUnique({ where: { id: productId } });

    if (!user || !product) {
      throw new Error("존재하지 않는 유저 또는 상품입니다.");
    }

    const existing = await tx.favorite.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      throw new Error("이미 좋아요를 누른 상품입니다.");
    }

    await tx.favorite.create({
      data: { userId: Number(userId), productId: Number(productId) },
    });

    return { isLiked: true };
  });
}

async function removeFavorite(
  productId: Favorite["productId"],
  userId: Favorite["userId"]
) {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.favorite.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (!existing) {
      throw new Error("좋아요 상태가 아닙니다.");
    }

    await tx.favorite.delete({
      where: { id: existing.id },
    });

    return { isLiked: false };
  });
}

async function isProductLikedByUser(
  productId: Favorite["productId"],
  userId: Favorite["userId"]
) {
  const favorite = await prisma.favorite.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  return !!favorite;
}

export default {
  addFavorite,
  removeFavorite,
  isProductLikedByUser,
};
