import prisma from "../../prisma/client.prisma.js";
import articleRepository from "../repositories/articleRepository.js";

// 게시글 목록 불러오기
const getArticles = async (query) => {
  const [articles, totalCount] = await articleRepository.findAll(query);

  if (!articles || articles.length === 0) {
    const error = new Error("게시글이 없습니다.");
    error.code = 404;

    throw error;
  }

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
const getArticle = async (userId, articleId) => {
  const [article, likeCount, isLiked] = await articleRepository.findById(
    userId,
    articleId
  );

  if (!article) {
    const error = new Error("해당 게시글을 찾을 수 없습니다.");
    error.code = 404;

    throw error;
  }

  return { ...article, likeCount, isLiked: !!isLiked };
};

// 게시글 작성
const createArticle = (userId, body) => {
  const { title, content } = body;

  if (!title || !content) {
    const error = new Error("필수 항목을 모두 입력해주세요.");
    error.code = 400;

    throw error;
  }

  return articleRepository.create(userId, body);
};

// 게시글 수정
const updateArticle = async (articleId, body) => {
  const { title, content } = body;

  if (!(title || content)) {
    const error = new Error("수정할 내용을 입력해주세요.");
    error.code = 400;

    throw error;
  }

  return await prisma.$transaction(async (tx) => {
    const article = await articleRepository.findByIdWithTx(tx, articleId);

    if (!article) {
      const error = new Error("해당 게시글을 찾을 수 없습니다.");
      error.code = 404;

      throw error;
    }

    return articleRepository.updateWithTx(tx, articleId, body);
  });
};

// 게시글 삭제
const deleteArticle = async (articleId) => {
  return await prisma.$transaction(async (tx) => {
    const article = await articleRepository.findByIdWithTx(tx, articleId);

    if (!article) {
      const error = new Error("이미 삭제된 게시글입니다.");
      error.code = 404;

      throw error;
    }

    return articleRepository.deleteWithTx(tx, articleId);
  });
};

// 게시글 좋아요
const addlikeArticle = (userId, articleId) => {
  return articleRepository.addlikeArticle(userId, articleId);
};

// 게시글 좋아요 취소
const cancelLikeArticle = (userId, articleId) => {
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
