import { Request, Response } from 'express';
import prisma from '../models/prisma/prismaClient';
import catchAsync from '../utils/catchAsync';

export const createArticle = catchAsync(async (req: Request, res: Response) => {
  const newArticle = await prisma.article.create({
    data: { ...req.body, userId: (req.user as any).id },
  });
  res.status(201).send(newArticle);
});

export const getAllArticles = catchAsync(async (req: Request, res: Response) => {
  const articles = await prisma.article.findMany();
  res.send(articles);
});

export const getArticleById = catchAsync(async (req: Request, res: Response) => {
  const article = await prisma.article.findUnique({
    where: { id: parseInt(req.params.articleId) },
  });
  if (!article) {
    return res.status(404).send({ message: 'Article not found' });
  }
  res.send(article);
});

export const updateArticle = catchAsync(async (req: Request, res: Response) => {
  const updatedArticle = await prisma.article.update({
    where: { id: parseInt(req.params.articleId) },
    data: req.body,
  });
  res.send(updatedArticle);
});

export const deleteArticle = catchAsync(async (req: Request, res: Response) => {
  await prisma.article.delete({
    where: { id: parseInt(req.params.articleId) },
  });
  res.status(204).send();
});

export const likeArticle = catchAsync(async (req: Request, res: Response) => {
  res.send({ message: 'Article liked' });
});

export const unlikeArticle = catchAsync(async (req: Request, res: Response) => {
  res.status(204).send();
});