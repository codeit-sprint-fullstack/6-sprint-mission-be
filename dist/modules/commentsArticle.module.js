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
 * 게시글 관련 댓글 코드입니다
 ********************************/
const express_1 = __importDefault(require("express"));
const client_prisma_js_1 = __importDefault(require("../config/client.prisma.js"));
const articleCommentsRouter = express_1.default.Router();
/**
 * 댓글 등록
 */
articleCommentsRouter.post("/articles/:articleId/comments", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articleId = Number(req.params.articleId);
        const { content } = req.body;
        if (!articleId)
            throw new Error("존재하지 않는 게시글입니다");
        const comment = yield client_prisma_js_1.default.comment.create({
            data: { content, articleId },
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
articleCommentsRouter.get("/articles/:articleId/comments", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articleId = Number(req.params.articleId);
        if (!articleId)
            throw new Error("존재하지 않는 게시글입니다.");
        const comments = yield client_prisma_js_1.default.comment.findMany({
            where: { articleId },
        });
        if (comments.length === 0)
            return res.json([]);
        res.json(comments);
    }
    catch (e) {
        next(e);
    }
}));
/**
 * 댓글 수정
 */
articleCommentsRouter.patch("/comments/:commentId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = Number(req.params.commentId);
        const existingComment = yield client_prisma_js_1.default.comment.findUnique({
            where: { id: commentId },
        });
        if (!existingComment)
            return res.json("존재하지 않는 댓글입니다...");
        const { content } = req.body;
        const comment = yield client_prisma_js_1.default.comment.update({
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
articleCommentsRouter.delete("/comments/:commentId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = Number(req.params.commentId);
        const existingComment = yield client_prisma_js_1.default.comment.findUnique({
            where: { id: commentId },
        });
        if (!existingComment)
            return res.status(404).json("존재하지 않는 댓글은 삭제할 수 없습니다..");
        yield client_prisma_js_1.default.comment.delete({ where: { id: commentId } });
        res.status(200).json("댓글이 삭제되었습니다.");
    }
    catch (e) {
        next(e);
    }
}));
module.exports = articleCommentsRouter;
//# sourceMappingURL=commentsArticle.module.js.map