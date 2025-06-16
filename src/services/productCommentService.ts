import { Product, ProductComment, User } from "@prisma/client";
import prisma from "../config/client.prisma";
import productCommentRepository from "../repositories/productCommentRepository";
import { NotFoundError } from "../types/errors";

type TGetCommentsQuery = {
  limit: string;
  cursor: string;
};

// 상품 댓글 불러오기
const getComments = async (
  productId: Product["id"],
  query: TGetCommentsQuery
) => {
  const { cursor } = query;

  const comment = await productCommentRepository.findByCursor(
    productId,
    cursor
  );

  return await productCommentRepository.findAll(query, productId, comment);
};

// 상품 댓글 작성
const createComments = async (
  userId: User["id"],
  productId: Product["id"],
  body: Pick<ProductComment, "content">
) => {
  const { content } = body;

  return await prisma.$transaction(async (tx) => {
    return await productCommentRepository.createComment(
      userId,
      productId,
      content,
      { tx }
    );
  });
};

// 상품 댓글 수정
const updateComment = async (
  productId: Product["id"],
  commentId: ProductComment["id"],
  body: Pick<ProductComment, "content">
) => {
  const { content } = body;

  const comment = await productCommentRepository.findById(productId, commentId);

  if (!comment) throw new NotFoundError("존재하지 않는 댓글입니다.");

  return await prisma.$transaction(async (tx) => {
    return await productCommentRepository.updateComment(
      productId,
      commentId,
      content,
      { tx }
    );
  });
};

// 상품 댓글 삭제
const deleteComment = async (
  productId: Product["id"],
  commentId: ProductComment["id"]
) => {
  const comment = await productCommentRepository.findById(productId, commentId);

  if (!comment) throw new NotFoundError("이미 삭제된 댓글입니다.");

  return await prisma.$transaction(async (tx) => {
    return await productCommentRepository.deleteComment(productId, commentId, {
      tx,
    });
  });
};

export default {
  getComments,
  createComments,
  updateComment,
  deleteComment,
};
