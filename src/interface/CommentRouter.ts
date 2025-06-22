import express, { Request, Response, NextFunction } from 'express';
import { create } from 'superstruct';

import { AuthTokenManager } from '../infra/AuthTokenManager';
import { asyncErrorHandler } from './utils/asyncErrorHandler';
import { AuthN } from './utils/AuthN.js';

import { UpdateCommentRequestStruct } from './structs/comment/UpdateCommentRequestStruct';

import { UpdateCommentHandler } from '../application/comment/UpdateCommentHandler';
import { DeleteCommentHandler } from '../application/comment/DeleteCommentHandler';

export const CommentRouter = express.Router();

// 댓글 수정 API
CommentRouter.patch(
  '/:commentId',
  AuthN(),
  asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requester = AuthTokenManager.getRequesterFromToken(req.headers.authorization);
      const { commentId } = req.params;
      const { content } = create(req.body, UpdateCommentRequestStruct);
      
      if (typeof content !== 'string') {
          throw new Error('Content is required');
        }

      const commentView = await UpdateCommentHandler.handle(requester, {
        commentId: Number(commentId),
        content,
      });

      res.send(commentView);
    } catch (err) {
      next(err);
    }
  }),
);

// 댓글 삭제 API
CommentRouter.delete(
  '/:commentId',
  AuthN(),
  asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requester = AuthTokenManager.getRequesterFromToken(req.headers.authorization);
      const { commentId } = req.params;

      await DeleteCommentHandler.handle(requester, {
        commentId: Number(commentId),
      });

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }),
);
