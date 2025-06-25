import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getComments, createComment, updateComment, deleteComment, } from "../controllers/comment.controller.js";
const router = express.Router();
// 댓글 조회
router.get("/:productId/comments", getComments);
// 댓글 작성
router.post("/:productId/comments", verifyToken, createComment);
// 댓글 수정
router.patch("/comments/:commentId", verifyToken, updateComment);
// 댓글 삭제
router.delete("/comments/:commentId", verifyToken, deleteComment);
export default router;
