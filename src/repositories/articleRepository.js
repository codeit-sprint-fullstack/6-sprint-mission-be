import { prisma } from "../db/prisma/client.prisma.js";

// 전체 조회
async function findAll(options) {
  // select와 include를 동시에 사용할 수 없으므로 분기 처리
  if (options.select) {
    // select를 사용하는 경우에는 select 내부에 user 객체를 넣어야 함
    return prisma.article.findMany({
      ...options,
      select: {
        ...options.select,
        user: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
    });
  } else {
    // select를 사용하지 않는 경우 include만 사용
    return prisma.article.findMany({
      ...options,
      include: {
        ...(options.include || {}),
        user: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
    });
  }
}

// 단일 조회
async function findById(id, userId) {
  return prisma.article.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
          image: true,
        },
      },
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
