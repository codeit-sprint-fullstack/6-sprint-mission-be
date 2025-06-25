import { Article } from "@prisma/client";
import prisma from "../config/prisma";

// 게시글 생성
export async function createArticle(data: {
  title: string;
  content: string;
  userId: number;
}): Promise<Article> {
  return prisma.article.create({ data });
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
export async function getArticleById(
  id: number,
  userId?: number
): Promise<any | null> {
  const article = await prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      userId: true, // ✅ 이게 있어야 userId 비교 가능
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
export async function updateArticle(data: {
  id: number;
  userId: number;
  title?: string;
  content?: string;
}): Promise<Article> {
  const { id, userId, title, content } = data;

  // 게시글 존재 및 권한 확인
  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    const error = new Error("게시글을 찾을 수 없습니다.") as Error & {
      code?: number;
    };
    error.code = 404;
    throw error;
  }

  if (article.userId !== userId) {
    const error = new Error("수정 권한이 없습니다.") as Error & {
      code?: number;
    };
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
export async function deleteArticle(
  id: number,
  userId: number
): Promise<Article> {
  // 게시글 존재 및 권한 확인
  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    const error = new Error("게시글을 찾을 수 없습니다.") as Error & {
      code?: number;
    };
    error.code = 404;
    throw error;
  }

  if (article.userId !== userId) {
    const error = new Error("삭제 권한이 없습니다.") as Error & {
      code?: number;
    };
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
export async function likeArticle(
  articleId: number,
  userId: number
): Promise<{ message: string }> {
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
      const err = new Error("이미 좋아요를 누르셨습니다.") as Error & {
        code?: number;
      };
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
export async function unlikeArticle(
  articleId: number,
  userId: number
): Promise<{ message: string }> {
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
      const err = new Error("좋아요 기록이 없습니다.") as Error & {
        code?: number;
      };
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
