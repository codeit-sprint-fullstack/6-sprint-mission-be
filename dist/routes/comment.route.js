"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const comment_controller_js_1 = require("../controllers/comment.controller.js");
const router = express_1.default.Router();
// 댓글 조회 
router.get("/:productId/comments", comment_controller_js_1.getComments);
// 댓글 작성
router.post("/:productId/comments", auth_middleware_js_1.verifyToken, comment_controller_js_1.createComment);
// 댓글 수정
router.patch("/comments/:commentId", auth_middleware_js_1.verifyToken, comment_controller_js_1.updateComment);
// 댓글 삭제
router.delete("/comments/:commentId", auth_middleware_js_1.verifyToken, comment_controller_js_1.deleteComment);
exports.default = router;
