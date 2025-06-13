import { NextFunction, Request, RequestHandler, Response } from "express";
import articleService from "../services/articleService";
import { Article } from "@prisma/client";
import { AuthenticationError } from "../types/errors";

type TGetArticlesQuery = {
  offset: string;
  limit: string;
  orderBy: string;
  keyword: string;
};

type TGetArticlesResult = [
  {
    likeCount: number;
    author: {
      nickname: string;
    };
    id: number;
    title: string;
    content: string;
    createdAt: Date;
  }[],
  number
];

// 게시글 목록 불러오기
const getArticles: RequestHandler<{}, {}, {}, TGetArticlesQuery> = async (
  req,
  res,
  next
) => {
  try {
    const [articles, totalCount]: TGetArticlesResult =
      await articleService.getArticles(req.query);

    res.status(200).json({ list: articles, totalCount });
  } catch (e) {
    next(e);
  }
};

// 게시글 상세조회
const getArticle = async (
  req: Request<{ articleId: string }>,
  res: Response,
  next: NextFunction
) => {
  if (!req.auth) {
    throw new AuthenticationError("유효하지 않은 토큰입니다.");
  }

  const userId = req.auth.id;
  const articleId = Number(req.params.articleId);

  try {
    const article = await articleService.getArticle(userId, articleId);

    res.status(200).json(article);
  } catch (e) {
    next(e);
  }
};

// 게시글 작성
const createArticle: RequestHandler<
  {},
  {},
  Pick<Article, "title" | "content">
> = async (req, res, next) => {
  if (!req.auth) {
    throw new AuthenticationError("유효하지 않은 토큰입니다.");
  }

  const userId = req.auth.id;

  try {
    const newArticle = await articleService.createArticle(userId, req.body);

    res.status(201).json(newArticle);
  } catch (e) {
    next(e);
  }
};

// 게시글 수정
const updateArticle: RequestHandler<
  { articleId: string },
  {},
  Pick<Article, "title" | "content">
> = async (req, res, next) => {
  if (!req.auth) {
    throw new AuthenticationError("유효하지 않은 토큰입니다.");
  }

  const userId = req.auth.id;
  const articleId = Number(req.params.articleId);

  try {
    const updatedArticle = await articleService.updateArticle(
      userId,
      articleId,
      req.body
    );

    res.status(200).json(updatedArticle);
  } catch (e) {
    next(e);
  }
};

// 게시글 삭제
const deleteArticle: RequestHandler<{ articleId: string }> = async (
  req,
  res,
  next
) => {
  if (!req.auth) {
    throw new AuthenticationError("유효하지 않은 토큰입니다.");
  }

  const userId = req.auth.id;
  const articleId = Number(req.params.articleId);

  try {
    await articleService.deleteArticle(userId, articleId);

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

// 게시글 좋아요
const addlikeArticle: RequestHandler<{ articleId: string }> = async (
  req,
  res,
  next
) => {
  if (!req.auth) {
    throw new AuthenticationError("유효하지 않은 토큰입니다.");
  }

  const userId = req.auth.id;
  const articleId = Number(req.params.articleId);

  try {
    const like = await articleService.addlikeArticle(userId, articleId);

    res.status(200).json(like);
  } catch (e) {
    next(e);
  }
};

// 게시글 좋아요 취소
const cancelLikeArticle: RequestHandler<{ articleId: string }> = async (
  req,
  res,
  next
) => {
  if (!req.auth) {
    throw new AuthenticationError("유효하지 않은 토큰입니다.");
  }

  const userId = req.auth.id;
  const articleId = Number(req.params.articleId);

  try {
    const cancelLike = await articleService.cancelLikeArticle(
      userId,
      articleId
    );

    res.status(200).json(cancelLike);
  } catch (e) {
    next(e);
  }
};

export default {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  addlikeArticle,
  cancelLikeArticle,
};
