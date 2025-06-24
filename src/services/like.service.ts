import prisma from '../db/prisma';
import likeRepository from '../repositories/like.repository';

const likeService = {
  addLike: async (userId: string, articleId: number | null, productId: number | null) => {
    return prisma.$transaction(async (tx) => {
      if (!articleId && !productId) {
        throw { status: 400, message: '게시글 ID 또는 상품 ID 중 하나는 필수입니다.' };
      }
      if (articleId) {
        const existingLike = await tx.like.findUnique({ 
          where: {
            userId_articleId: {
              userId,
              articleId,
            },
          },
        });
        if (existingLike) {
          throw { status: 409, message: '이미 좋아요를 누르셨습니다.' };
        }
        return tx.like.create({ 
          data: {
            userId,
            articleId,
            productId,
          },
        });
      }
      if (productId) {
        const existingLike = await tx.like.findUnique({ 
          where: {
            userId_productId: {
              userId,
              productId,
            },
          },
        });
        if (existingLike) {
          throw { status: 409, message: '이미 좋아요를 누르셨습니다.' };
        }
        return tx.like.create({ 
          data: {
            userId,
            articleId,
            productId,
          },
        });
      }
    });
  },

  removeLike: async (userId: string, articleId: number | null, productId: number | null) => {
    return prisma.$transaction(async (tx) => {
      if (!articleId && !productId) {
        throw { status: 400, message: '게시글 ID 또는 상품 ID 중 하나는 필수입니다.' };
      }
      const deleteResult = await tx.like.deleteMany({ 
        where: {
          userId,
          articleId,
          productId,
        },
      });
      if (deleteResult.count === 0) {
        throw { status: 404, message: '좋아요를 찾을 수 없습니다.' };
      }
      return deleteResult;
    });
  },

  getArticleLikeCount: async (articleId: number) => {
    return likeRepository.countLikesByArticleId(articleId); 
  },

  getProductLikeCount: async (productId: number) => {
    return likeRepository.countLikesByProductId(productId); 
  },
};

export default likeService; 