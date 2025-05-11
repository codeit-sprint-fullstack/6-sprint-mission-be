import { prisma } from "../db/prisma/client.prisma.js";

// 전체 조회
async function findAll(options) {
  return prisma.article.findMany(options);
}

// 단일 조회
async function findById(id, userId) {
  return prisma.article.findUnique({
    where: {
      id,
    },
    include: {
      ...(userId && {
        ArticleLike: {
          where: { userId },
          select: { id: true },
        },
      }),
    },
  });
}

// 현재 좋아요한 컬럼만 추출
async function findLikedArticleIdsByUser(userId, articleIds) {
  return prisma.articleLike.findMany({
    where: {
      userId,
      articleId: {
        in: articleIds,
      },
    },
    select: {
      articleId: true,
    },
  });
}

async function create(articleData) {
  return prisma.article.create({
    data: articleData,
  });
}

async function count(where) {
  return prisma.article.count({
    where,
  });
}

async function update(id, data) {
  return prisma.article.update({
    where: { id },
    data,
  });
}

async function remove(id) {
  return prisma.article.delete({
    where: { id },
  });
}

export default {
  findById,
  findLikedArticleIdsByUser,
  create,
  findAll,
  count,
  update,
  remove,
};
