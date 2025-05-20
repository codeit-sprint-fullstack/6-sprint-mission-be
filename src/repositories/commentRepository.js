import { prisma } from "../db/prisma/client.prisma.js";

/**
 * 특정 게시글의 댓글 목록 조회
 */
const findByArticleId = async (articleId) => {
  return prisma.comment.findMany({
    where: {
      articleId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * 특정 상품의 댓글 목록 조회
 */
const findByProductId = async (productId) => {
  return prisma.comment.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * 댓글 생성
 */
const create = async (data) => {
  return prisma.comment.create({
    data,
  });
};

/**
 * 댓글 상세 조회
 */
const findById = async (id) => {
  return prisma.comment.findUnique({
    where: {
      id,
    },
  });
};

/**
 * 댓글 수정
 */
const update = async (id, data) => {
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
const remove = async (id) => {
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
