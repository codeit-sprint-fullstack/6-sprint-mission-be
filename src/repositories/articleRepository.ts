import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma/client.prisma";
import { ArticleCreateDto, ArticleParamsDto } from "../dtos/article.dto";
import { UserParamsDto } from "../dtos/user.dto";

// 전체 조회
async function findAll(options: Prisma.ArticleFindManyArgs) {
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
async function findById(
  id: ArticleParamsDto["id"],
  userId?: UserParamsDto["id"]
) {
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
        articleLikes: {
          where: { userId },
          select: { id: true },
        },
      }),
    },
  });
}

// 현재 좋아요한 컬럼만 추출
async function findLikedArticleIdsByUser(
  userId: UserParamsDto["id"],
  articleIds: ArticleParamsDto["id"][]
) {
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

async function create(articleData: ArticleCreateDto) {
  return prisma.article.create({
    data: {
      ...articleData,
      likes: articleData.likes || 0,
    },
  });
}

async function count(where: Prisma.ArticleWhereInput) {
  return prisma.article.count({
    where,
  });
}

async function update(
  id: ArticleParamsDto["id"],
  data: Partial<ArticleCreateDto>
) {
  return prisma.article.update({
    where: { id },
    data: {
      ...data,
      likes: data.likes || 0,
    },
  });
}

async function remove(id: ArticleParamsDto["id"]) {
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
