import prisma from "../db/prisma/client.js";

/**
 * 자유게시글 생성
 */
async function createArticle(article) {
  const createdArticle = await prisma.article.create({
    data: {
      title: article.title,
      content: article.content,
      image: article.image ?? null,
      author: {
        connect: {
          id: article.authorId,
        },
      },
    },
  });
  return createdArticle;
}

/**
 * 자유게시글 ID로 조회
 */
async function getById(id) {
  const getArticle = await prisma.article.findUnique({
    where: {
      id: parseInt(id, 10),
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          profileImageUrl: true,
        },
      },
      comments: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              profileImageUrl: true,
            },
          },
        },
      },
    },
  });
  return getArticle;
}

/**
 * 자유게시글 전체 조회
 */
async function getAll() {
  const getAllArticles = await prisma.article.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          profileImageUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return getAllArticles;
}

/**
 * 자유게시글 수정
 */
async function updateById(id, article) {
  const updatedArticle = await prisma.article.update({
    where: {
      id: parseInt(id, 10),
    },
    data: {
      title: article.title,
      content: article.content,
      image: article.image ? article.image : null,
    },
  });
  return updatedArticle;
}

/**
 * 자유게시글 삭제
 */
async function deleteById(id) {
  const deletedArticle = await prisma.article.delete({
    where: {
      id: parseInt(id, 10),
    },
  });
  return deletedArticle;
}

/**
 * 좋아요 추가
 */
async function addLike(userId, articleId) {
  await prisma.articleLike.create({
    data: { userId, articleId },
  });

  await prisma.article.update({
    where: { id: articleId },
    data: { likeCount: { increment: 1 } },
  });
}

/**
 * 좋아요 취소
 */
async function removeLike(userId, articleId) {
  await prisma.articleLike.delete({
    where: {
      userId_articleId: { userId, articleId },
    },
  });

  await prisma.article.update({
    where: { id: articleId },
    data: { likeCount: { decrement: 1 } },
  });
}

/**
 * 유저가 해당 게시글 좋아요 했는지 확인
 */
async function hasUserLiked(userId, articleId) {
  const like = await prisma.articleLike.findUnique({
    where: {
      userId_articleId: { userId, articleId },
    },
  });
  return !!like;
}

export default {
  createArticle,
  getById,
  getAll,
  updateById,
  deleteById,
  addLike,
  removeLike,
  hasUserLiked,
};
