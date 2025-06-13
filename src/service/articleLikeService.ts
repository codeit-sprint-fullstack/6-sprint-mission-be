import { Article, User } from "@prisma/client";
import { prisma } from "../db/prisma/client.prisma";
import { P2002Error } from "../types/dbError";

const likeArticle = async (userId: User["id"], articleId: Article["id"]) => {
  try {
    const liked = await prisma.$transaction([
      prisma.articleLike.create({
        data: { userId, articleId },
      }),
      prisma.article.update({
        where: { id: articleId },
        data: { likes: { increment: 1 } }, // 좋아요 수 +1
      }),
    ]);

    return { message: "좋아요 완료", liked };
  } catch (error) {
    if (error instanceof P2002Error) {
      // Prisma unique constraint violation
      return { message: "이미 좋아요를 눌렀습니다." };
    }
    throw error; // 예상 외 에러는 그대로 throw
  }
};

const unlikeArticle = async (userId: User["id"], articleId: Article["id"]) => {
  try {
    await prisma.$transaction([
      prisma.articleLike.delete({
        where: {
          userId_articleId: { userId, articleId },
        },
      }),
      prisma.article.update({
        where: { id: articleId },
        data: { likes: { decrement: 1 } }, // 좋아요 수 -1
      }),
    ]);

    return { message: "좋아요 취소 완료" };
  } catch (error) {
    throw error;
  }
};

export default {
  likeArticle,
  unlikeArticle,
};
