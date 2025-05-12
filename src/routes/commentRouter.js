import express from "express";
import auth from "../middlewares/auth.js";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/commentController.js";
import { commentValidator, validate } from "../middlewares/validator.js";

// 중첩 라우터 설정
const commentRouter = express.Router({ mergeParams: true });

commentRouter.post(
  "/",
  auth.verifyAccessToken,
  commentValidator,
  validate,
  createComment
);
commentRouter.get("/", auth.verifyAccessToken, getComments);
commentRouter.patch(
  "/:commentId",
  auth.verifyAccessToken,
  commentValidator,
  validate,
  updateComment
);
commentRouter.delete("/:commentId", auth.verifyAccessToken, deleteComment);

export default commentRouter;
