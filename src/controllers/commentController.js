import express from "express";
import auth from "../middlewares/auth.js";
import commentService from "../services/commentService.js";

const commentController = express.Router();

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
