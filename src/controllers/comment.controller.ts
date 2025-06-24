import { Request, Response } from 'express';
import prisma from '../models/prisma/prismaClient';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/apiError';

export const createProductComment = catchAsync(async (req: Request, res: Response) => {
  const productId = parseInt(req.params.productId);
  const { content } = req.body;
  const userId = (req.user as any).id;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const newComment = await prisma.comment.create({
    data: {
      content: content,
      userId: userId,
      productId: productId,
    },
  });
  res.status(201).send(newComment);
});

export const getProductComments = catchAsync(async (req: Request, res: Response) => {
  const comments = await prisma.comment.findMany({
    where: { productId: parseInt(req.params.productId) },
    include: { user: true },
  });
  res.send(comments);
});

export const updateComment = catchAsync(async (req: Request, res: Response) => {
  const commentId = parseInt(req.params.commentId);
  const { content } = req.body;
  const userId = (req.user as any).id; // 인증된 사용자 ID

  const existingComment = await prisma.comment.findUnique({ where: { id: commentId } });

  if (!existingComment) {
    throw new ApiError(404, 'Comment not found');
  }

  if (existingComment.userId !== userId) {
    throw new ApiError(403, 'You are not authorized to update this comment');
  }

  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: { content: content }, // req.body 전체 대신 명시적으로 content만 업데이트
  });
  res.send(updatedComment);
});

export const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const commentId = parseInt(req.params.commentId);
  const userId = (req.user as any).id; // 인증된 사용자 ID

  const existingComment = await prisma.comment.findUnique({ where: { id: commentId } });

  if (!existingComment) {
    throw new ApiError(404, 'Comment not found');
  }

  if (existingComment.userId !== userId) {
    throw new ApiError(403, 'You are not authorized to delete this comment');
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });
  res.status(204).send();
});