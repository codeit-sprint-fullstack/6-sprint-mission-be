import { NextFunction, Request, RequestHandler, Response } from "express";
import articleService from "../services/article.service";
import { AuthenticationError } from "../types/errors";
import {
  articleDto,
  articleParamsDto,
  articleQueryDto,
} from "../dtos/article.dto";

// 게시글 목록 불러오기
const getArticles: RequestHandler<{}, {}, {}, articleQueryDto> = async (
  req,
  res,
  next
) => {
  try {
    const [articles, totalCount] = await articleService.getArticles(req.query);

    res.status(200).json({ list: articles, totalCount });
  } catch (e) {
    next(e);
  }
};

// 게시글 상세조회
const getArticle: RequestHandler<articleParamsDto> = async (req, res, next) => {
  if (!req.auth) throw new AuthenticationError("인증되지 않은 사용자입니다.");

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
const createArticle: RequestHandler<{}, {}, articleDto> = async (
  req,
  res,
  next
) => {
  if (!req.auth) throw new AuthenticationError("인증되지 않은 사용자입니다.");

  const userId = req.auth.id;

  try {
    const newArticle = await articleService.createArticle(userId, req.body);

    res.status(201).json(newArticle);
  } catch (e) {
    next(e);
  }
};

// 게시글 수정
const updateArticle: RequestHandler<articleParamsDto, {}, articleDto> = async (
  req,
  res,
  next
) => {
  if (!req.auth) throw new AuthenticationError("인증되지 않은 사용자입니다.");

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
const deleteArticle: RequestHandler<articleParamsDto> = async (
  req,
  res,
  next
) => {
  if (!req.auth) throw new AuthenticationError("인증되지 않은 사용자입니다.");

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
const addlikeArticle: RequestHandler<articleParamsDto> = async (
  req,
  res,
  next
) => {
  if (!req.auth) throw new AuthenticationError("인증되지 않은 사용자입니다.");

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
const cancelLikeArticle: RequestHandler<articleParamsDto> = async (
  req,
  res,
  next
) => {
  if (!req.auth) throw new AuthenticationError("인증되지 않은 사용자입니다.");

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
