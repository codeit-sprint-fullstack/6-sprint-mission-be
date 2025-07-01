"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.getProductComments = exports.createProductComment = void 0;
const prismaClient_1 = __importDefault(require("../models/prisma/prismaClient"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const apiError_1 = __importDefault(require("../utils/apiError"));
exports.createProductComment = (0, catchAsync_1.default)(async (req, res) => {
    const productId = parseInt(req.params.productId);
    const { content } = req.body;
    const userId = req.user.id;
    const product = await prismaClient_1.default.product.findUnique({ where: { id: productId } });
    if (!product) {
        throw new apiError_1.default(404, 'Product not found');
    }
    const newComment = await prismaClient_1.default.comment.create({
        data: {
            content: content,
            userId: userId,
            productId: productId,
        },
    });
    res.status(201).send(newComment);
});
exports.getProductComments = (0, catchAsync_1.default)(async (req, res) => {
    const comments = await prismaClient_1.default.comment.findMany({
        where: { productId: parseInt(req.params.productId) },
        include: { user: true },
    });
    res.send(comments);
});
exports.updateComment = (0, catchAsync_1.default)(async (req, res) => {
    const commentId = parseInt(req.params.commentId);
    const { content } = req.body;
    const userId = req.user.id; // 인증된 사용자 ID
    const existingComment = await prismaClient_1.default.comment.findUnique({ where: { id: commentId } });
    if (!existingComment) {
        throw new apiError_1.default(404, 'Comment not found');
    }
    if (existingComment.userId !== userId) {
        throw new apiError_1.default(403, 'You are not authorized to update this comment');
    }
    const updatedComment = await prismaClient_1.default.comment.update({
        where: { id: commentId },
        data: { content: content }, // req.body 전체 대신 명시적으로 content만 업데이트
    });
    res.send(updatedComment);
});
exports.deleteComment = (0, catchAsync_1.default)(async (req, res) => {
    const commentId = parseInt(req.params.commentId);
    const userId = req.user.id; // 인증된 사용자 ID
    const existingComment = await prismaClient_1.default.comment.findUnique({ where: { id: commentId } });
    if (!existingComment) {
        throw new apiError_1.default(404, 'Comment not found');
    }
    if (existingComment.userId !== userId) {
        throw new apiError_1.default(403, 'You are not authorized to delete this comment');
    }
    await prismaClient_1.default.comment.delete({
        where: { id: commentId },
    });
    res.status(204).send();
});
