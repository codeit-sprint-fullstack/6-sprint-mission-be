import { RequestHandler } from "express";
import productCommentService from "../services/productComment.service";
import { AuthenticationError } from "../types/errors";
import {
  ProductCommentDto,
  ProductCommentParamsDto,
  ProductCommentQueryDto,
} from "../dtos/productComment.dto";

// 상품 댓글 불러오기
const getComments: RequestHandler<
  ProductCommentParamsDto,
  {},
  {},
  ProductCommentQueryDto
> = async (req, res, next) => {
  const productId = Number(req.params.productId);

  try {
    const productComments = await productCommentService.getComments(
      productId,
      req.query
    );

    res.json(productComments);
  } catch (e) {
    next(e);
  }
};

// 상품 댓글 작성
const createComments: RequestHandler<
  ProductCommentParamsDto,
  {},
  ProductCommentDto
> = async (req, res, next) => {
  if (!req.auth) throw new AuthenticationError("인증되지 않은 사용자입니다.");

  const userId = req.auth.id;
  const productId = Number(req.params.productId);

  try {
    const newProductComment = await productCommentService.createComments(
      userId,
      productId,
      req.body
    );

    res.status(201).json(newProductComment);
  } catch (e) {
    next(e);
  }
};

// 상품 댓글 수정
const updateComment: RequestHandler<
  ProductCommentParamsDto,
  {},
  ProductCommentDto
> = async (req, res, next) => {
  const productId = Number(req.params.productId);
  const commentId = Number(req.params.commentId);

  try {
    const updateProductComment = await productCommentService.updateComment(
      productId,
      commentId,
      req.body
    );

    res.status(200).json(updateProductComment);
  } catch (e) {
    next(e);
  }
};

// 상품 댓글 삭제
const deleteComment: RequestHandler<ProductCommentParamsDto> = async (
  req,
  res,
  next
) => {
  const productId = Number(req.params.productId);
  const commentId = Number(req.params.commentId);

  try {
    await productCommentService.deleteComment(productId, commentId);

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export default {
  getComments,
  createComments,
  updateComment,
  deleteComment,
};
