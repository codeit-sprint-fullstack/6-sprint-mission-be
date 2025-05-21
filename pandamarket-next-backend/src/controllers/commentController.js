import auth from "../middlewares/auth.js";
import commentService from "../services/commentService.js";
import express from "express";

const commentController = express.Router();

/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: 댓글 수정
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 수정할 댓글의 ID
 *         required: true
 *         schema:
 *           type: string
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
 *                 description: 수정할 댓글 내용
 *     responses:
 *       201:
 *         description: 댓글 수정 완료
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       401:
 *         description: 권한 없음
 *       422:
 *         description: 댓글 존재하지 않음
 */
commentController.patch(
  "/:id",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const { content } = req.body;
      const userId = req.auth.userId;
      const comment = await commentService.getById(id);
      if (!comment) {
        const error = new Error("수정하려는 댓글이 존재하지 않습니다.");
        error.code = 422;
        throw error;
      }
      if (comment.userId !== userId) {
        const error = new Error("권한이 없습니다.-작성자가 아닙니다.");
        error.code = 401;
        throw error;
      }

      const updatedcomment = await commentService.patchComment(id, { content });
      res.status(201).json(updatedcomment);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: 댓글 삭제
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 삭제할 댓글의 ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: 댓글 삭제 성공
 *       401:
 *         description: 권한 없음
 *       422:
 *         description: 댓글 존재하지 않음
 */
commentController.delete(
  "/:id",
  auth.verifyAccessToken,
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const userId = req.auth.userId;
      const comment = await commentService.getById(id);
      if (!comment) {
        const error = new Error("삭제하려는 댓글이 존재하지 않습니다.");
        error.code = 422;
        throw error;
      }
      if (comment.userId !== userId) {
        const error = new Error("권한이 없습니다.-작성자가 아닙니다.");
        error.code = 401;
        throw error;
      }
      await commentService.deleteComment(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default commentController;
