import express, { Router, RequestHandler } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";

const router: Router = express.Router();

// 댓글 조회
router.get("/:productId/comments", getComments as unknown as RequestHandler);

// 댓글 작성
router.post("/:productId/comments", verifyToken as unknown as RequestHandler, createComment as unknown as RequestHandler);

// 댓글 수정
router.patch("/comments/:commentId", verifyToken as unknown as RequestHandler, updateComment as unknown as RequestHandler);

// 댓글 삭제
router.delete("/comments/:commentId", verifyToken as unknown as RequestHandler, deleteComment as unknown as RequestHandler);

export default router; 