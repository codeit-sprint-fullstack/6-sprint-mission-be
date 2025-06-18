import express from "express";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/commentController";
import { commentValidator, validator } from "../middlewares/validator";
import { verifyAccessToken } from "../middlewares/verifyToken";

// 중첩 라우터 설정
const commentRouter = express.Router({ mergeParams: true });

commentRouter.post(
  "/",
  verifyAccessToken,
  commentValidator,
  validator,
  createComment
);
commentRouter.get("/", getComments);
commentRouter.patch(
  "/:commentId",
  verifyAccessToken,
  commentValidator,
  validator,
  updateComment
);
commentRouter.delete("/:commentId", verifyAccessToken, deleteComment);

export default commentRouter;
