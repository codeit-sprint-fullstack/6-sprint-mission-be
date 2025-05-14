import express from "express";
import auth from "../middlewares/auth.js";
import commentService from "../services/commentService.js";

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
  .all(auth.varifyAccessToken, auth.verifyCommentAuth)

  .patch(async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const updatedComment = await commentService.update(id, req.body);
      return res.json(updatedComment);
    } catch (error) {
      next(error);
    }
  })

  .delete(async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const deletedComment = await commentService.deleteById(id);
      return res.json(deletedComment);
    } catch (error) {
      next(error);
    }
  });

export default commentController;
