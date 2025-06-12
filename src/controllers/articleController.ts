import { ExceptionMessage } from "../ExceptionMessage";
import { NotFoundError } from "../types/exceptions";
import { NextFunction, Request, Response } from "express";
import articleService from "../services/articleService";

interface ArticleQuery {
  page?: string;
  pageSize?: string;
  orderBy?: "recent" | "like";
  keyword?: string;
}

// 게시글 목록 조회
export async function getArticles(
  req: Request<{}, {}, {}, ArticleQuery>,
  res: Response,
  next: NextFunction
) {
  try {
    const articles = await articleService.getArticles({
      page: Number(req.query.page) || 1,
      pageSize: Number(req.query.pageSize) || 10,
      orderBy: req.query.orderBy || "recent",
      keyword: req.query.keyword || null,
    });
    res.json({ totalCount: articles.length, list: articles });
  } catch (e) {
    next(e);
  }
}

// 게시글 등록
export async function createArticle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body;
    const { userId } = req.auth;
    const article = await articleService.createArticle(data, Number(userId));
    const { writerId, ...rest } = article;
    res.status(201).json(rest);
  } catch (e) {
    next(e);
  }
}

// 게시글 조회
export async function getArticle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const articleId = Number(req.params.articleId);
    const { userId } = req.auth;
    const [like, article] = await articleService.getArticle(
      articleId,
      Number(userId)
    );
    if (!article) {
      throw new NotFoundError(ExceptionMessage.ARTICLE_NOT_FOUND);
    }
    const { writerId, ...rest } = article;
    res.json({ ...rest, isLiked: !!like });
  } catch (e) {
    next(e);
  }
}

// 게시글 수정
export async function updateArticle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const articleId = Number(req.params.articleId);
    const data = req.body;
    const article = await articleService.updateArticle(articleId, data);
    const { writerId, ...rest } = article;
    res.json(rest);
  } catch (e) {
    next(e);
  }
}

// 게시글 삭제
export async function deleteArticle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const articleId = Number(req.params.articleId);
    await articleService.deleteArticle(articleId);
    res.json({ id: articleId });
  } catch (e) {
    next(e);
  }
}

// 게시글 좋아요
export async function likeArticle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const articleId = +req.params.articleId;
    const userId = req.auth.userId;
    const article = await articleService.likeArticle(articleId, Number(userId));
    const { writerId, ...rest } = article;
    res.json({ ...rest, isLiked: true });
  } catch (e) {
    next(e);
  }
}

// 게시글 좋아요 취소
export async function unlikeArticle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const articleId = +req.params.articleId;
    const userId = req.auth.userId;
    const article = await articleService.unlikeArticle(
      articleId,
      Number(userId)
    );
    const { writerId, ...rest } = article;
    res.json({ ...rest, isLiked: false });
  } catch (e) {
    next(e);
  }
}
