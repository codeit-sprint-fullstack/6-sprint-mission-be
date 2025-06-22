import articleRepository from "../repositories/articleRepository";
import {
  ArticleService,
  CreateArticleInput,
  UpdateArticleInput,
} from "../types/index";
import { Article } from "@prisma/client";

/**
 * 자유게시글 등록
 */
async function create(article: CreateArticleInput): Promise<Article> {
  return await articleRepository.createArticle(article);
}

/**
 * 자유게시글 ID로 조회
 */
async function getById(id: number): Promise<any> {
  return await articleRepository.getById(id);
}

/**
 * 자유게시글 전체 조회
 */
async function getAll(): Promise<any[]> {
  return await articleRepository.getAll();
}

/**
 * 자유게시글 수정
 */
async function updateById(
  id: number,
  article: UpdateArticleInput
): Promise<Article> {
  return await articleRepository.updateById(id, article);
}

/**
 * 자유게시글 삭제
 */
async function deleteById(id: number): Promise<Article> {
  return await articleRepository.deleteById(id);
}

/**
 * 자유게시글 좋아요 추가
 */
async function addLike(userId: number, articleId: number): Promise<void> {
  return await articleRepository.addLike(userId, articleId);
}

/**
 * 자유게시글 좋아요 취소
 */
async function removeLike(userId: number, articleId: number): Promise<void> {
  return await articleRepository.removeLike(userId, articleId);
}

/**
 * 유저가 자유게시글에 좋아요 눌렀는지 확인
 */
async function hasUserLiked(
  userId: number,
  articleId: number
): Promise<boolean> {
  return await articleRepository.hasUserLiked(userId, articleId);
}

const articleService: ArticleService = {
  create,
  getById,
  getAll,
  updateById,
  deleteById,
  addLike,
  removeLike,
  hasUserLiked,
};

export default articleService;
