import { ProductComment } from "@prisma/client";
import prisma from "../config/prisma";

interface FindByProductIdParams {
  productId: number;
  limit: number;
  cursor?: number;
}

interface CreateCommentParams {
  content: string;
  userId: number;
  productId: number;
}

// 상품 댓글 조회 (+ 최신순, 커서, 제한)
async function findByProductId({
  productId,
  limit,
  cursor,
}: FindByProductIdParams): Promise<
  (ProductComment & {
    writer: { id: number; nickName: string };
  })[]
> {
  return prisma.productComment.findMany({
    where: { productId },
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
}

// 상품 댓글 등록
async function create({
  content,
  userId,
  productId,
}: CreateCommentParams): Promise<
  ProductComment & {
    writer: { id: number; nickName: string };
  }
> {
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
