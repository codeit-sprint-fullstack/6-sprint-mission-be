import auth from "../middlewares/auth.js";
import commentService from "../services/commentService.js";
import express from "express";

const commentController = express.Router();

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
      res.status(201).json();
    } catch (error) {
      next(error);
    }
  }
);

export default commentController;
