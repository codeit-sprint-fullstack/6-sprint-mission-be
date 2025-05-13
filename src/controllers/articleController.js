import { ARTICLE_NOT_FOUND } from "../constant.js";
import { NotFoundError } from "../exceptions.js";
import articleService from "../services/articleService.js";

/**
 * 게시글 목록 조회
 */
export async function getArticles(req, res, next) {
  try {
    const articles = await articleService.getArticles({
      page: Number(req.query.page),
      pageSize: Number(req.query.pageSize),
      orderBy: req.query.orderBy,
      keyword: req.query.keyword,
    });
    res.json({ totalCount: articles.length, list: articles });
  } catch (e) {
    next(e);
  }
}

/**
 * 게시글 등록
 */
export async function createArticle(req, res, next) {
  try {
    const data = req.body;
    const { userId } = req.auth;
    const article = await articleService.createArticle(data, userId);
    const { writerId, ...rest } = article;
    res.status(201).json(rest);
  } catch (e) {
    next(e);
  }
}

/**
 * 게시글 조회
 */
export async function getArticle(req, res, next) {
  try {
    const articleId = Number(req.params.articleId);
    const { userId } = req.auth;
    const [like, article] = await articleService.getArticle(articleId, userId);
    if (!article) {
      throw new NotFoundError(ARTICLE_NOT_FOUND);
    }
    const { writerId, ...rest } = article;
    res.json({ ...rest, isLiked: !!like });
  } catch (e) {
    next(e);
  }
}

/**
 * 게시글 수정
 */
export async function updateArticle(req, res, next) {
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

/**
 * 게시글 삭제
 */
export async function deleteArticle(req, res, next) {
  try {
    const articleId = Number(req.params.articleId);
    await articleService.deleteArticle(articleId);
    res.json({ id: articleId });
  } catch (e) {
    next(e);
  }
}

/**
 * 게시글 좋아요
 */
export async function likeArticle(req, res, next) {
  try {
    const articleId = +req.params.articleId;
    const userId = req.auth.userId;
    const article = await articleService.likeArticle(articleId, userId);
    const { writerId, ...rest } = article;
    res.json({ ...rest, isLiked: true });
  } catch (e) {
    next(e);
  }
}

/**
 * 게시글 좋아요 취소
 */
export async function unlikeArticle(req, res, next) {
  try {
    const articleId = +req.params.articleId;
    const userId = req.auth.userId;
    const article = await articleService.unlikeArticle(articleId, userId);
    const { writerId, ...rest } = article;
    res.json({ ...rest, isLiked: false });
  } catch (e) {
    next(e);
  }
}
