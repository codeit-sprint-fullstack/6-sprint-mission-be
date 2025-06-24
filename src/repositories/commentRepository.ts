import { prisma } from "../db/prisma/client.prisma";
import { ArticleParamsDto } from "../dtos/article.dto";
import {
  CommentCreateDto,
  CommentDto,
  CommentParamsDto,
} from "../dtos/comment.dto";
import { ProductParamsDto } from "../dtos/product.dto";

/**
 * 특정 게시글의 댓글 목록 조회
 */
const findByArticleId = async (articleId: ArticleParamsDto["id"]) => {
  const comments = await prisma.comment.findMany({
    where: { articleId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, nickname: true, image: true },
      },
    },
    omit: {
      userId: true,
      updatedAt: true,
      productId: true,
    },
  });

  // ✅ user → author 로 필드명 변경
  return comments.map(({ user, ...rest }) => ({
    ...rest,
    author: user, // 원하는 새 이름
  }));
};

/**
 * 특정 상품의 댓글 목록 조회
 */
const findByProductId = async (productId: ProductParamsDto["id"]) => {
  const comments = await prisma.comment.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
          image: true,
        },
      },
    },
    omit: {
      userId: true,
      updatedAt: true,
      articleId: true,
    },
  });

  return comments.map(({ user, ...rest }) => ({
    ...rest,
    author: user,
  }));
};

/**
 * 댓글 생성
 */
const create = async (data: CommentCreateDto) => {
  return prisma.comment.create({
    data,
  });
};

/**
 * 댓글 상세 조회
 */
const findById = async (id: CommentParamsDto["id"]) => {
  return prisma.comment.findUnique({
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
    },
  });
};

/**
 * 댓글 수정
 */
const update = async (
  id: CommentParamsDto["id"],
  data: Pick<CommentDto, "content">
) => {
  return prisma.comment.update({
    where: {
      id,
    },
    data,
  });
};

/**
 * 댓글 삭제
 */
const remove = async (id: CommentParamsDto["id"]) => {
  return prisma.comment.delete({
    where: {
      id,
    },
  });
};

export default {
  findByArticleId,
  findByProductId,
  create,
  findById,
  update,
  remove,
};
