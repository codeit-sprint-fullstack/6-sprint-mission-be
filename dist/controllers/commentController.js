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
const express_1 = __importDefault(require("express"));
const commentService_1 = __importDefault(require("../services/commentService"));
const asyncHandler_1 = require("../utils/asyncHandler");
const passport_1 = __importDefault(require("../config/passport"));
const CustomError_1 = require("../utils/CustomError");
const commentController = express_1.default.Router();
commentController.post("/products/:productId/comments", passport_1.default.authenticate("access-token", {
    session: false,
    failWithError: true,
}), (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    if (!req.user || !req.user.id) {
        throw new CustomError_1.CustomError(401, "인증되지 않은 사용자이거나 사용자 ID가 없습니다.");
    }
    const writerId = req.user.id;
    const { content } = req.body;
    const comment = yield commentService_1.default.createProductComment(productId, writerId, content);
    res.status(201).json(comment);
})));
commentController.get("/products/:productId/comments", (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const comments = yield commentService_1.default.getProductComments(productId, req.query);
    res.json(comments);
})));
commentController.post("/articles/:articleId/comments", passport_1.default.authenticate("access-token", {
    session: false,
    failWithError: true,
}), (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { articleId } = req.params;
    if (!req.user || !req.user.id) {
        throw new CustomError_1.CustomError(401, "인증되지 않은 사용자이거나 사용자 ID가 없습니다.");
    }
    const writerId = req.user.id;
    const { content } = req.body;
    const comment = yield commentService_1.default.createArticleComment(parseInt(articleId, 10), writerId, content);
    res.status(201).json(comment);
})));
commentController.get("/articles/:articleId/comments", (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { articleId } = req.params;
    const comments = yield commentService_1.default.getArticleComments(parseInt(articleId, 10), req.query);
    res.json(comments);
})));
commentController.patch("/comments/:commentId", passport_1.default.authenticate("access-token", {
    session: false,
    failWithError: true,
}), (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    if (!req.user || !req.user.id) {
        throw new CustomError_1.CustomError(401, "인증되지 않은 사용자이거나 사용자 ID가 없습니다.");
    }
    const writerId = req.user.id;
    const { content } = req.body;
    const updatedComment = yield commentService_1.default.updateComment(parseInt(commentId, 10), content, writerId);
    res.json(updatedComment);
})));
commentController.delete("/comments/:commentId", passport_1.default.authenticate("access-token", {
    session: false,
    failWithError: true,
}), (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    if (!req.user || !req.user.id) {
        throw new CustomError_1.CustomError(401, "인증되지 않은 사용자이거나 사용자 ID가 없습니다.");
    }
    const writerId = req.user.id;
    yield commentService_1.default.deleteComment(parseInt(commentId, 10), writerId);
    res.status(204).send();
})));
exports.default = commentController;
//# sourceMappingURL=commentController.js.map