"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.createComment = exports.getComments = void 0;
const client_js_1 = __importDefault(require("../db/prisma/client.js"));
// 댓글 목록 조회
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.productId);
        const comments = yield client_js_1.default.comment.findMany({
            where: { productId },
            orderBy: { createdAt: "desc" },
            include: {
                writer: {
                    select: {
                        id: true,
                        userName: true,
                    },
                },
            },
        });
        res.json({ list: comments });
    }
    catch (error) {
        console.error("댓글 목록 조회 오류:", error);
        res.status(500).json({ message: "댓글 조회 실패" });
    }
});
exports.getComments = getComments;
// 댓글 작성
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.productId);
        const userId = req.user.id;
        const { content } = req.body;
        const comment = yield client_js_1.default.comment.create({
            data: {
                content,
                productId,
                userId,
            },
            include: {
                writer: {
                    select: {
                        id: true,
                        userName: true,
                    },
                },
            },
        });
        res.status(201).json({ comment });
    }
    catch (error) {
        console.error("댓글 작성 오류:", error);
        res.status(500).json({ message: "댓글 작성 실패" });
    }
});
exports.createComment = createComment;
// 댓글 수정
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = parseInt(req.params.commentId);
        const { content } = req.body;
        const existing = yield client_js_1.default.comment.findUnique({
            where: { id: commentId },
        });
        if (!existing || existing.userId !== req.user.id) {
            return res.status(403).json({ message: "수정 권한이 없습니다." });
        }
        const updated = yield client_js_1.default.comment.update({
            where: { id: commentId },
            data: { content },
        });
        res.json({ comment: updated });
    }
    catch (error) {
        console.error("댓글 수정 오류:", error);
        res.status(500).json({ message: "댓글 수정 실패" });
    }
});
exports.updateComment = updateComment;
// 댓글 삭제
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = parseInt(req.params.commentId);
        const existing = yield client_js_1.default.comment.findUnique({
            where: { id: commentId },
        });
        if (!existing || existing.userId !== req.user.id) {
            return res.status(403).json({ message: "삭제 권한이 없습니다." });
        }
        yield client_js_1.default.comment.delete({
            where: { id: commentId },
        });
        res.json({ message: "댓글 삭제 성공" });
    }
    catch (error) {
        console.error("댓글 삭제 오류:", error);
        res.status(500).json({ message: "댓글 삭제 실패" });
    }
});
exports.deleteComment = deleteComment;
