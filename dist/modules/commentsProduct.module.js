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
/********************************
 * 상품 관련 댓글 코드입니다
 ********************************/
const express_1 = __importDefault(require("express"));
const client_prisma_js_1 = __importDefault(require("../config/client.prisma.js"));
const productCommentsRouter = express_1.default.Router();
/**
 * 댓글 등록
 */
productCommentsRouter.post("/:productId/comment", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = Number(req.params.productId);
        if (!productId)
            throw new Error("존재하지 않는 상품입니다");
        const { content } = req.body;
        const comment = yield client_prisma_js_1.default.productComment.create({
            data: { content, productId },
        });
        res.json(comment);
    }
    catch (e) {
        next(e);
    }
}));
/**
 * 댓글 목록 조회
 */
productCommentsRouter.get("/:productId/comments", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
        const productId = Number(req.params.productId);
        if (!productId)
            return res.json("존재하지 않는 상품입니다");
        const comments = yield client_prisma_js_1.default.productComment.findMany({
            where: { productId },
            cursor: cursor ? { id: cursor } : undefined,
        });
        if (comments.length === 0)
            return res.json("해당 상품에는 댓글이 존재하지 않습니다.");
        res.json(comments);
    }
    catch (e) {
        next(e);
    }
}));
/**
 * 댓글 수정
 */
productCommentsRouter.patch("/comment/:commentId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = Number(req.params.commentId);
        if (!commentId)
            throw new Error("해당 게시글엔 존재하지 않는 댓글입니다...");
        const { content } = req.body;
        const comment = yield client_prisma_js_1.default.productComment.update({
            where: { id: commentId },
            data: { content },
        });
        res.json(comment);
    }
    catch (e) {
        next(e);
    }
}));
/**
 * 댓글 삭제
 */
productCommentsRouter.delete("/comment/:commentId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = Number(req.params.commentId);
        const existingComment = yield client_prisma_js_1.default.productComment.findUnique({
            where: { id: commentId },
        });
        if (!existingComment)
            return res.status(404).json("존재하지 않는 댓글은 삭제할 수 없습니다..");
        yield client_prisma_js_1.default.productComment.delete({ where: { id: commentId } });
        res.status(200).json("댓글이 삭제되었습니다.");
    }
    catch (e) {
        next(e);
    }
}));
module.exports = productCommentsRouter;
//# sourceMappingURL=commentsProduct.module.js.map