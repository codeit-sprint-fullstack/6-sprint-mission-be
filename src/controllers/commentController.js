import * as commentService from '../services/commentService.js';
import { HttpError } from '../middlewares/HttpError.js';

// 게시글 댓글 생성
export const createArticleComment = async (req, res, next) => {
    try {
        const { articleId } = req.params;
        const { content } = req.body;
        const userId = req.userId;

        const comment = await commentService.createArticleComment(
            userId,
            Number(articleId),
            content,
        );
        res.status(201).json(comment);
    } catch (err) {
        next(err);
    }
};

// 상품 댓글 생성
export const createProductComment = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { content } = req.body;
        const userId = req.userId;

        const comment = await commentService.createProductComment(
            userId,
            Number(productId),
            content,
        );
        res.status(201).json(comment);
    } catch (err) {
        next(err);
    }
};

// 게시글 댓글 수정
export const updateArticleComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.userId;

        const updated = await commentService.updateArticleComment(
            Number(commentId),
            userId,
            content,
        );
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

// 상품 댓글 수정
export const updateProductComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.userId;

        const updated = await commentService.updateProductComment(
            Number(commentId),
            userId,
            content,
        );
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

// 게시글 댓글 삭제
export const deleteArticleComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const userId = req.userId;

        const deleted = await commentService.deleteArticleComment(Number(commentId), userId);
        res.status(200).json(deleted);
    } catch (err) {
        next(err);
    }
};

// 상품 댓글 삭제
export const deleteProductComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const userId = req.userId;

        const deleted = await commentService.deleteProductComment(Number(commentId), userId);
        res.status(200).json(deleted);
    } catch (err) {
        next(err);
    }
};

// 댓글 목록 조회 (게시글)
export const getArticleComments = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { cursor, limit } = req.query;
        const comments = await commentService.getArticleComments(Number(id), {
            cursor: cursor ? Number(cursor) : undefined,
            limit: Number(limit) || 10,
        });

        res.status(200).json(comments);
    } catch (err) {
        next(err);
    }
};

// 댓글 목록 조회 (상품)
export const getProductComments = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { cursor, limit } = req.query;
        const comments = await commentService.getProductComments(Number(id), {
            cursor: cursor ? Number(cursor) : undefined,
            limit: Number(limit) || 10,
        });

        res.status(200).json(comments);
    } catch (err) {
        next(err);
    }
};
