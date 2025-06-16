import { RequestHandler } from "express";
import articleCommentService from "../services/articleCommentService";
import { AuthenticationError } from "../types/errors";
import {
  ArticleCommentDto,
  ArticleCommentParamsDto,
  ArticleCommentQueryDto,
} from "../dtos/articleComment.dto";

// 게시글 댓글 불러오기
const getComments: RequestHandler<
  ArticleCommentParamsDto,
  {},
  {},
  ArticleCommentQueryDto
> = async (req, res, next) => {
  const articleId = Number(req.params.articleId);

  try {
    const articleComments = await articleCommentService.getComments(
      articleId,
      req.query
    );

    res.json(articleComments);
  } catch (e) {
    next(e);
  }
};

// 게시글 댓글 작성
const createComment: RequestHandler<
  ArticleCommentParamsDto,
  {},
  ArticleCommentDto
> = async (req, res, next) => {
  if (!req.auth) throw new AuthenticationError("인증되지 않은 사용자입니다.");

  const userId = req.auth.id;
  const articleId = Number(req.params.articleId);

  try {
    const newArticleComment = await articleCommentService.createComment(
      userId,
      articleId,
      req.body
    );

    res.status(201).json(newArticleComment);
  } catch (e) {
    next(e);
  }
};

// 게시글 댓글 수정
const updateComment: RequestHandler<
  ArticleCommentParamsDto,
  {},
  ArticleCommentDto
> = async (req, res, next) => {
  const articleId = Number(req.params.articleId);
  const commentId = Number(req.params.commentId);

  try {
    const updateArticleComment = await articleCommentService.updateComment(
      articleId,
      commentId,
      req.body
    );

    res.status(200).json(updateArticleComment);
  } catch (e) {
    next(e);
  }
};

// 게시글 댓글 삭제
const deleteComment: RequestHandler<ArticleCommentParamsDto> = async (
  req,
  res,
  next
) => {
  const articleId = Number(req.params.articleId);
  const commentId = Number(req.params.commentId);

  try {
    await articleCommentService.deleteComment(articleId, commentId);

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export default {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};
