import express from "express";
import auth from "../middlewares/auth";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/commentController";
import { commentValidator } from "../middlewares/validator";

// 중첩 라우터 설정
const commentRouter = express.Router({ mergeParams: true });

commentRouter.post(
  "/",
  auth.verifyAccessToken,
  commentValidator,

  createComment
);
commentRouter.get("/", getComments);
commentRouter.patch(
  "/:commentId",
  auth.verifyAccessToken,
  commentValidator,

  updateComment
);
commentRouter.delete("/:commentId", auth.verifyAccessToken, deleteComment);

export default commentRouter;
