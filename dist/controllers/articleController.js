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
const articleService_1 = __importDefault(require("../services/articleService"));
const passport_1 = __importDefault(require("../config/passport"));
const asyncHandler_1 = require("../utils/asyncHandler");
const CustomError_1 = require("../utils/CustomError");
const articleController = express_1.default.Router();
articleController.post("/", passport_1.default.authenticate("access-token", {
    session: false,
    failWithError: true,
}), (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new CustomError_1.CustomError(401, "인증되지 않은 사용자이거나 사용자 ID가 없습니다.");
    }
    const writerId = req.user.id;
    const articleData = Object.assign(Object.assign({}, req.body), { writerId });
    if (!articleData.title || !articleData.content) {
        throw new CustomError_1.CustomError(422, "제목과 내용은 필수입니다.");
    }
    const article = yield articleService_1.default.createArticle(articleData);
    res.status(201).json(article);
})));
articleController.get("/", (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const articles = yield articleService_1.default.getArticles(req.query, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    res.json(articles);
})));
articleController.get("/:articleId", (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { articleId } = req.params;
    const article = yield articleService_1.default.getArticleById(parseInt(articleId, 10), (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    res.json(article);
})));
articleController.patch("/:articleId", passport_1.default.authenticate("access-token", {
    session: false,
    failWithError: true,
}), (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new CustomError_1.CustomError(401, "인증되지 않은 사용자이거나 사용자 ID가 없습니다.");
    }
    const { articleId } = req.params;
    const writerId = req.user.id;
    const updateData = req.body;
    const updatedArticle = yield articleService_1.default.updateArticle(parseInt(articleId, 10), updateData, writerId);
    res.json(updatedArticle);
})));
articleController.delete("/:articleId", passport_1.default.authenticate("access-token", {
    session: false,
    failWithError: true,
}), (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new CustomError_1.CustomError(401, "인증되지 않은 사용자이거나 사용자 ID가 없습니다.");
    }
    const { articleId } = req.params;
    const writerId = req.user.id;
    yield articleService_1.default.deleteArticle(parseInt(articleId, 10), writerId);
    res.status(204).send();
})));
articleController.post("/:articleId/like", passport_1.default.authenticate("access-token", {
    session: false,
    failWithError: true,
}), (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new CustomError_1.CustomError(401, "인증되지 않은 사용자이거나 사용자 ID가 없습니다.");
    }
    const { articleId } = req.params;
    const userId = req.user.id;
    const result = yield articleService_1.default.likeArticle(parseInt(articleId, 10), userId);
    res
        .status(201)
        .json({ message: "게시글에 좋아요를 눌렀습니다.", data: result });
})));
articleController.delete("/:articleId/like", passport_1.default.authenticate("access-token", {
    session: false,
    failWithError: true,
}), (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new CustomError_1.CustomError(401, "인증되지 않은 사용자이거나 사용자 ID가 없습니다.");
    }
    const { articleId } = req.params;
    const userId = req.user.id;
    yield articleService_1.default.unlikeArticle(parseInt(articleId, 10), userId);
    res.status(200).json({ message: "게시글 좋아요를 취소했습니다." });
})));
exports.default = articleController;
//# sourceMappingURL=articleController.js.map