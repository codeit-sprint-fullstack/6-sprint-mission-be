import { Article, User } from "@prisma/client";
import prisma from "../config/client.prisma";
import articleRepository from "../repositories/article.repository";
import { BadRequestError, NotFoundError } from "../types/errors";

type TGetArticlesQuery = {
  offset: string;
  limit: string;
  orderBy: string;
  keyword: string;
};

type TGetArticlesResult = Promise<
  [
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
  ]
>;

// 게시글 목록 불러오기
const getArticles = async (query: TGetArticlesQuery): TGetArticlesResult => {
  const [articles, totalCount] = await articleRepository.findAll(query);

  if (!articles || articles.length === 0)
    throw new NotFoundError("게시글이 없습니다.");

  const articletWithLikeCount = await Promise.all(
    articles.map(async (article) => {
      const likeCount = await articleRepository.findArticleLikeCountById(
        article.id
      );

      return { ...article, likeCount };
    })
  );

  return [articletWithLikeCount, totalCount];
};

// 게시글 상세조회
const getArticle = async (userId: User["id"], articleId: Article["id"]) => {
  const [article, likeCount, isLiked] = await articleRepository.findById(
    userId,
    articleId
  );

  if (!article) throw new NotFoundError("해당 게시글을 찾을 수 없습니다.");

  return { ...article, likeCount, isLiked: !!isLiked };
};

// 게시글 작성
const createArticle = (
  userId: User["id"],
  body: Pick<Article, "title" | "content">
) => {
  const { title, content } = body;

  if (!title || !content)
    throw new BadRequestError("필수 항목을 모두 입력해주세요.");

  return articleRepository.createArticle(userId, body);
};

// 게시글 수정
const updateArticle = async (
  userId: User["id"],
  articleId: Article["id"],
  body: Pick<Article, "title" | "content">
) => {
  const { title, content } = body;

  if (!(title || content))
    throw new BadRequestError("수정할 내용을 입력해주세요.");

  return await prisma.$transaction(async (tx) => {
    const article = await articleRepository.findById(userId, articleId);

    if (!article) throw new NotFoundError("해당 게시글을 찾을 수 없습니다.");

    return articleRepository.updateArticle(articleId, body, { tx });
  });
};

// 게시글 삭제
const deleteArticle = async (userId: User["id"], articleId: Article["id"]) => {
  return await prisma.$transaction(async (tx) => {
    const article = await articleRepository.findById(userId, articleId);

    if (!article) throw new NotFoundError("이미 삭제된 게시글입니다.");

    return articleRepository.deleteArticle(articleId, { tx });
  });
};

// 게시글 좋아요
const addlikeArticle = (userId: User["id"], articleId: Article["id"]) => {
  return articleRepository.addlikeArticle(userId, articleId);
};

// 게시글 좋아요 취소
const cancelLikeArticle = (userId: User["id"], articleId: Article["id"]) => {
  return articleRepository.cancelLikeArticle(userId, articleId);
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
