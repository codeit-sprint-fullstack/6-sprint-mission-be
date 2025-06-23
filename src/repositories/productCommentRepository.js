import prisma from "../config/prisma.js";

// 상품 댓글 조회 (+ 최신순, 커서, 제한)
async function findByProductId({ productId, limit, cursor }) {
  const where = { productId };

  const comments = await prisma.productComment.findMany({
    where,
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { id: "desc" },
    include: {
      writer: {
        select: {
          id: true,
          nickName: true,
        },
      },
    },
  });

  return comments;
}

// 상품 댓글 등록
async function create({ content, userId, productId }) {
  return prisma.productComment.create({
    data: {
      content,
      userId,
      productId,
    },
    include: {
      writer: {
        select: {
          id: true,
          nickName: true,
        },
      },
    },
  });
}

export default {
  findByProductId,
  create,
};
