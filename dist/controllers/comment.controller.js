var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "../db/prisma/client.js";
// 댓글 목록 조회
export const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.productId);
        const comments = yield prisma.comment.findMany({
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
// 댓글 작성
export const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const productId = parseInt(req.params.productId);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { content } = req.body;
        if (!userId) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다." });
            return;
        }
        const comment = yield prisma.comment.create({
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
// 댓글 수정
export const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const commentId = parseInt(req.params.commentId);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { content } = req.body;
        if (!userId) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다." });
            return;
        }
        const existing = yield prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!existing || existing.userId !== userId) {
            res.status(403).json({ message: "수정 권한이 없습니다." });
            return;
        }
        const updated = yield prisma.comment.update({
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
// 댓글 삭제
export const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const commentId = parseInt(req.params.commentId);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다." });
            return;
        }
        const existing = yield prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!existing || existing.userId !== userId) {
            res.status(403).json({ message: "삭제 권한이 없습니다." });
            return;
        }
        yield prisma.comment.delete({
            where: { id: commentId },
        });
        res.json({ message: "댓글 삭제 성공" });
    }
    catch (error) {
        console.error("댓글 삭제 오류:", error);
        res.status(500).json({ message: "댓글 삭제 실패" });
    }
});
