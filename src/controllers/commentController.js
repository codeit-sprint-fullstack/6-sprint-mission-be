import express from "express";
import auth from "../middlewares/auth.js";
import commentService from "../services/commentService.js";

const commentController = express.Router();

commentController.post(
  "/:id",
  auth.varifyAccessToken,
  async (req, res, nest) => {
    const { userId } = req.auth;
    const createdComment = await commentService.create({
      ...req.body,
      authorId: userId,
    });
    return res.json(createdComment);
  }
);

export default commentController;
