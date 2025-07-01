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
const auth_1 = __importDefault(require("../middlewares/auth"));
const articleService_1 = __importDefault(require("../services/articleService"));
const errors_1 = require("../types/errors");
const article_dto_1 = require("../dto/article.dto");
const comment_dto_1 = require("../dto/comment.dto");
const articleController = express_1.default.Router();
const articleCommentController = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: 게시글 관련 API
 */
/**
 * @swagger
 * /articles:
 *   post:
 *     summary: 게시글 등록
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 게시글이 성공적으로 생성됨
 *   get:
 *     summary: 게시글 조회
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: 게시글 목록 반환
 */
//게시글 등록, 조회
articleController
    .route("/")
    .post(auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId))
            throw new errors_1.AuthenticationError("인증된 유저가 아닙니다.");
        const parsedBody = article_dto_1.ArticleBodySchema.safeParse(req.body);
        if (!parsedBody.success)
            throw new errors_1.ValidationError("잘못된 요청입니다.");
        const createdArticle = yield articleService_1.default.create(Object.assign(Object.assign({}, parsedBody.data), { authorId: req.auth.userId }));
        res.status(200).json(createdArticle);
    }
    catch (error) {
        next(error);
    }
}))
    .get((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield articleService_1.default.getAll();
        res.status(200).json(articles);
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: 특정 게시글 조회 (댓글 포함)
 *     tags: [Articles]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 게시글 및 댓글 반환
 *   patch:
 *     summary: 게시글 수정
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 수정할 게시글 ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 게시글 수정 완료
 *   delete:
 *     summary: 게시글 삭제
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 삭제할 게시글 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 게시글 삭제 완료
 */
//게시글 상세 조회, 수정, 삭제
articleController
    .route("/:id")
    .get(auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id: articleId } = article_dto_1.IdParamSchema.parse(req.params);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new errors_1.AuthenticationError("인증된 사용자가 아닙니다.");
        const article = yield articleService_1.default.getById(articleId, userId);
        if (!article)
            throw new errors_1.NotFoundError("해당 게시글을 찾을 수 없습니다.");
        const articleComments = yield articleService_1.default.getAllArticleComment(articleId);
        res.json({ article, articleComments });
    }
    catch (error) {
        next(error);
    }
}))
    .patch(auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = article_dto_1.IdParamSchema.parse(req.params);
        const parsed = article_dto_1.ArticlePatchSchema.safeParse(req.body);
        if (!parsed.success)
            throw new errors_1.ValidationError("잘못된 요청입니다.");
        const patchedArticle = yield articleService_1.default.update(id, parsed.data);
        res.json(patchedArticle);
    }
    catch (error) {
        next(error);
    }
}))
    .delete(auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = article_dto_1.IdParamSchema.parse(req.params);
        const deletedArticle = yield articleService_1.default.deleteById(id);
        res.json(deletedArticle);
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @swagger
 * /articles/{id}/comments:
 *   post:
 *     summary: 게시글에 댓글 등록
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 댓글을 등록할 게시글 ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 댓글 등록 성공
 *   get:
 *     summary: 특정 게시글의 댓글 목록 조회
 *     tags: [Articles]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 댓글을 조회할 게시글 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 댓글 목록 반환
 */
//게시글에 댓글 등록하기
articleCommentController
    .route("/:id/comments")
    .post(auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: articleId } = article_dto_1.IdParamSchema.parse(req.params);
        if (!req.auth)
            throw new errors_1.AuthenticationError("작성자가 아닙니다");
        const { userId } = req.auth;
        const parsed = comment_dto_1.CommentBodySchema.safeParse(req.body);
        if (!parsed.success)
            throw new errors_1.ValidationError("잘못된 요청입니다.");
        const comment = yield articleService_1.default.createArticleComment(Object.assign(Object.assign({}, parsed.data), { articleId, authorId: userId }));
        res.json(comment);
    }
    catch (error) {
        next(error);
    }
}))
    .get((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = article_dto_1.IdParamSchema.parse(req.params);
        const articleComments = yield articleService_1.default.getAllArticleComment(id);
        res.json(articleComments);
    }
    catch (error) {
        next(error);
    }
}));
articleController.use("/", articleCommentController);
exports.default = articleController;
//# sourceMappingURL=articleController.js.map