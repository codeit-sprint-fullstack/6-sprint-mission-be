import { Request, Response } from 'express';
import prismaClient from '../models/prisma/prismaClient';
import catchAsync from '../utils/catchAsync';

export const getMe = catchAsync(async (req: Request, res: Response) => {
  res.send(req.user);
});

export const updateMe = catchAsync(async (req: Request, res: Response) => {
  const updatedUser = await prismaClient.user.update({
    where: { id: (req.user as any).id },
    data: req.body,
  });
  res.send(updatedUser);
});

export const updatePassword = catchAsync(async (req: Request, res: Response) => {
  res.send({ message: 'Password updated' });
});

export const getMyProducts = catchAsync(async (req: Request, res: Response) => {
  const products = await prismaClient.product.findMany({
    where: { userId: (req.user as any).id },
  });
  res.send(products);
});

export const getMyFavorites = catchAsync(async (req: Request, res: Response) => {
  res.send({ message: 'User favorites' });
});