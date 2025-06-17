import express, { NextFunction, Response, Request } from "express";
import auth from "../middlewares/auth";
import commentService from "../services/commentService";
import { CommentBodyDTO, CommentBodySchema } from "../dto/comment.dto";
import { parse } from "path";
import { ValidationError } from "../types/errors";

const commentController = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: 댓글 관련 API
 */

/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: 댓글 수정
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 수정할 댓글 ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 댓글 수정 완료
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 댓글을 찾을 수 없음
 *
 *   delete:
 *     summary: 댓글 삭제
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 삭제할 댓글 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 댓글 삭제 완료
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 댓글을 찾을 수 없음
 */

commentController
  .route("/:id")
  .all(auth.verifyAccessToken, auth.verifyCommentAuth)

  .patch(
    async (
      req: Request<{ id: number }, {}, CommentBodyDTO>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const id = req.params.id;

      try {
        const parsed = CommentBodySchema.safeParse(req.body);
        if (!parsed.success)
          throw new ValidationError("요청 형식이 유효하지 않습니다");

        const updatedComment = await commentService.update(
          id,
          parsed.data.content
        );
        res.json(updatedComment);
      } catch (error) {
        next(error);
      }
    }
  )

  .delete(
    async (
      req: Request<{ id: number }>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { id } = req.params;
      try {
        const deletedComment = await commentService.deleteById(id);
        res.json(deletedComment);
      } catch (error) {
        next(error);
      }
    }
  );

export default commentController;
