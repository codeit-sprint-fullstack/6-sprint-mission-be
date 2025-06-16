import { Article, ArticleComment, User } from "@prisma/client";
import prisma from "../config/client.prisma";
import articleCommentRepository from "../repositories/articleCommentRepository";
import { NotFoundError } from "../types/errors";

type TGetCommentsQuery = {
  limit: string;
  cursor: string;
};

// 게시글 댓글 불러오기
const getComments = async (
  articleId: Article["id"],
  query: TGetCommentsQuery
) => {
  const { cursor } = query;

  const comment = await articleCommentRepository.findByCursor(
    articleId,
    cursor
  );

  return await articleCommentRepository.findAll(query, articleId, comment);
};

// 게시글 댓글 작성
const createComment = async (
  userId: User["id"],
  articleId: Article["id"],
  body: Pick<Article, "content">
) => {
  const { content } = body;

  return await prisma.$transaction(async (tx) => {
    return await articleCommentRepository.createComment(
      userId,
      articleId,
      content,
      { tx }
    );
  });
};

// 게시글 댓글 수정
const updateComment = async (
  articleId: Article["id"],
  commentId: ArticleComment["id"],
  body: Pick<ArticleComment, "content">
) => {
  const { content } = body;

  const comment = await articleCommentRepository.findById(articleId, commentId);

  if (!comment) throw new NotFoundError("존재하지 않는 댓글입니다.");

  return await prisma.$transaction(async (tx) => {
    return await articleCommentRepository.updateComment(
      articleId,
      commentId,
      content,
      { tx }
    );
  });
};

// 게시글 댓글 삭제
const deleteComment = async (
  articleId: Article["id"],
  commentId: ArticleComment["id"]
) => {
  const comment = await articleCommentRepository.findById(articleId, commentId);

  if (!comment) throw new NotFoundError("이미 삭제된 댓글입니다.");

  return await prisma.$transaction(async (tx) => {
    return await articleCommentRepository.deleteComment(articleId, commentId, {
      tx,
    });
  });
};

export default {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};
