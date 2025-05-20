import prisma from "../config/prisma.js";

// 게시글 생성
export async function createArticle(data) {
  return prisma.article.create({
    data: {
      title: data.title,
      content: data.content,
      userId: data.userId,
    },
  });
}

// 전체 게시글 목록 조회
export async function getAllArticles() {
  return prisma.article.findMany({
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
        },
      },
      likes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// 게시글 상세 조회
export async function getArticleById(id, userId) {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
        },
      },
      likes: true,
      comments: {
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!article) return null;

  return {
    ...article,
    likeCount: article.likes.length,
    isLiked: userId
      ? article.likes.some((like) => like.userId === userId)
      : false,
  };
}

// 게시글 수정
export async function updateArticle({ id, userId, title, content }) {
  // 게시글 존재 및 권한 확인
  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    const error = new Error("게시글을 찾을 수 없습니다.");
    error.code = 404;
    throw error;
  }

  if (article.userId !== userId) {
    const error = new Error("수정 권한이 없습니다.");
    error.code = 403;
    throw error;
  }

  return prisma.article.update({
    where: { id },
    data: {
      title,
      content,
    },
  });
}

// 게시글 삭제
export async function deleteArticle(id, userId) {
  // 게시글 존재 및 권한 확인
  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    const error = new Error("게시글을 찾을 수 없습니다.");
    error.code = 404;
    throw error;
  }

  if (article.userId !== userId) {
    const error = new Error("삭제 권한이 없습니다.");
    error.code = 403;
    throw error;
  }

  // Transaction으로 관련 데이터 삭제
  return prisma.$transaction(async (tx) => {
    // 1. 좋아요 삭제
    await tx.articleLike.deleteMany({
      where: { articleId: id },
    });

    // 2. 댓글 삭제
    await tx.articleComment.deleteMany({
      where: { articleId: id },
    });

    // 3. 게시글 삭제
    return tx.article.delete({
      where: { id },
    });
  });
}

// 게시글 좋아요
export async function likeArticle(articleId, userId) {
  return await prisma.$transaction(async (tx) => {
    // 이미 좋아요 했는지 확인
    const alreadyLiked = await tx.articleLike.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    if (alreadyLiked) {
      const err = new Error("이미 좋아요를 누르셨습니다.");
      err.code = 409;
      throw err;
    }

    await tx.articleLike.create({
      data: { userId, articleId },
    });

    return { message: "좋아요 완료" };
  });
}

// 게시글 좋아요 취소
export async function unlikeArticle(articleId, userId) {
  return await prisma.$transaction(async (tx) => {
    // 좋아요 데이터 확인
    const like = await tx.articleLike.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    if (!like) {
      const err = new Error("좋아요 기록이 없습니다.");
      err.code = 404;
      throw err;
    }

    await tx.articleLike.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    return { message: "좋아요 취소 완료" };
  });
}

export default {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  likeArticle,
  unlikeArticle,
};
