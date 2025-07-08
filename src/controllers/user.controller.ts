// src/controllers/user.controller.ts (재확인)
// 이 파일에 RequestWithUser 인터페이스와 req as RequestWithUser가 적용되어 있어야 합니다.

import { Request, Response } from 'express';
import prismaClient from '../models/prisma/prismaClient';
import catchAsync from '../utils/catchAsync';

interface RequestWithUser extends Request { // 이 인터페이스가 있는지 확인
  user?: {
    id: number;
    nickname: string;
    email: string;
  };
}

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const typedReq = req as RequestWithUser; // 이 부분이 있는지 확인
  res.send(typedReq.user);
});

export const updateMe = catchAsync(async (req: Request, res: Response) => {
  const typedReq = req as RequestWithUser; // 이 부분이 있는지 확인
  const updatedUser = await prismaClient.user.update({
    where: { id: typedReq.user!.id },
    data: typedReq.body,
  });
  res.send(updatedUser);
});

export const updatePassword = catchAsync(async (req: Request, res: Response) => {
  res.send({ message: 'Password updated' });
});

export const getMyProducts = catchAsync(async (req: Request, res: Response) => {
  const typedReq = req as RequestWithUser; // 이 부분이 있는지 확인
  const products = await prismaClient.product.findMany({
    where: { userId: typedReq.user!.id },
  });
  res.send(products);
});

export const getMyFavorites = catchAsync(async (req: Request, res: Response) => {
  res.send({ message: 'User favorites' });
});