import productLikeRepository from "../repositories/productLikeRepository.js";

const likeProduct = async (userId, productId) => {
  try {
    return await productLikeRepository.create(userId, productId);
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma unique constraint violation
      return { message: "이미 좋아요를 눌렀습니다." };
    }
    throw error; // 예상 외 에러는 그대로 throw
  }
};
const unlikeProduct = async (userId, productId) => {
  return await productLikeRepository.delete(userId, productId);
};

export default {
  likeProduct,
  unlikeProduct,
};
