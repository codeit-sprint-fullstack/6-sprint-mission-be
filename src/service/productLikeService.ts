import { Product, User } from "@prisma/client";
import productLikeRepository from "../repositories/productLikeRepository";
import { P2002Error } from "../types/dbError";

const likeProduct = async (userId: User["id"], productId: Product["id"]) => {
  try {
    return await productLikeRepository.create(userId, productId);
  } catch (error) {
    if (error instanceof P2002Error) {
      // Prisma unique constraint violation
      return { message: "이미 좋아요를 눌렀습니다." };
    }
    throw error; // 예상 외 에러는 그대로 throw
  }
};
const unlikeProduct = async (userId: User["id"], productId: Product["id"]) => {
  return await productLikeRepository.delete(userId, productId);
};

export default {
  likeProduct,
  unlikeProduct,
};
