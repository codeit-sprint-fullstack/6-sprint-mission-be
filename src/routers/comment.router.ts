import express from "express";
import {
  createCommentController,
  deleteCommentController,
  getCommentsController,
  updateCommentController,
} from "../controllers/comment.controller";
import { commentValidator, validator } from "../middlewares/validator";
import { verifyAccessToken } from "../middlewares/verifyToken";

// 중첩 라우터 설정
const commentRouter = express.Router({ mergeParams: true });

commentRouter.post(
  "/",
  verifyAccessToken,
  commentValidator,
  validator,
  createCommentController
);
commentRouter.get("/", getCommentsController);
commentRouter.patch(
  "/:commentId",
  verifyAccessToken,
  commentValidator,
  validator,
  updateCommentController
);
commentRouter.delete("/:commentId", verifyAccessToken, deleteCommentController);

export default commentRouter;
