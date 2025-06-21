import express, { Request, Response } from 'express';
import { create } from 'superstruct';

import { AuthTokenManager } from '../infra/AuthTokenManager';

import { asyncErrorHandler } from './utils/asyncErrorHandler';
import { AuthN } from './utils/AuthN';

import { UpdateCommentRequestStruct } from './structs/comment/UpdateCommentRequestStruct';

import { UpdateCommentHandler } from '../application/comment/UpdateCommentHandler';
import { DeleteCommentHandler } from '../application/comment/DeleteCommentHandler';

export const CommentRouter = express.Router();

// 댓글 수정 api
CommentRouter.patch(
    '/:commentId',
    AuthN(),
    asyncErrorHandler(async (req: Request<{commentId: string;}, {}, {content: string;}>, res: Response) => {
        const requester = AuthTokenManager.getRequesterFromToken(req.headers.authorization);

        const { commentId } = req.params;
        const { content } = create(req.body, UpdateCommentRequestStruct);

        const commentView = await UpdateCommentHandler.handle(requester, {
            commentId: Number(commentId),
            content,
        });

        return res.send(commentView);
    }),
);

// 댓글 삭제 api
CommentRouter.delete(
    '/:commentId',
    AuthN(),
    asyncErrorHandler(async (req: Request<{commentId: string;}>, res: Response) => {
        const requester = AuthTokenManager.getRequesterFromToken(req.headers.authorization);

        const { commentId } = req.params;

        await DeleteCommentHandler.handle(requester, {
            commentId: Number(commentId),
        });

        return res.status(204).send();
    }),
);
