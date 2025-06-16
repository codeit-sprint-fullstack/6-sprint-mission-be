import * as commentService from '../services/commentService.js';
import { HttpError } from '../middlewares/HttpError.js';
import { NextFunction, Request, Response } from 'express';

// 게시글 댓글 생성
export const createArticleComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { articleId } = req.params;
        const { content } = req.body;
        const userId = req.userId;

        const comment = await commentService.createArticleComment(
            userId!,
            Number(articleId),
            content,
        );
        res.status(201).json(comment);
    } catch (err) {
        next(err);
    }
};

// 상품 댓글 생성
export const createProductComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params;
        const { content } = req.body;
        const userId = req.userId;

        const comment = await commentService.createProductComment(
            userId!,
            Number(productId),
            content,
        );
        res.status(201).json(comment);
    } catch (err) {
        next(err);
    }
};

// 댓글 수정
export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.userId;

        const updated = await commentService.updateComment(Number(commentId), userId!, content);
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

// 댓글 삭제
export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId } = req.params;
        const userId = req.userId;

        await commentService.deleteComment(Number(commentId), userId!);
        res.sendStatus(204); // ✅ No Content, 응답 바디 없음
    } catch (err) {
        next(err);
    }
};

// 댓글 목록 조회 (게시글)
export const getArticleComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { cursor, limit } = req.query;
        const comments = await commentService.getArticleComments(Number(id), {
            cursor: cursor ? Number(cursor) : 0,
            limit: Number(limit) || 10,
        });

        res.status(200).json(comments);
    } catch (err) {
        next(err);
    }
};

// 댓글 목록 조회 (상품)
export const getProductComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { cursor, limit } = req.query;
        const comments = await commentService.getProductComments(Number(id), {
            cursor: cursor ? Number(cursor) : 0,
            limit: Number(limit) || 10,
        });

        res.status(200).json(comments);
    } catch (err) {
        next(err);
    }
};
