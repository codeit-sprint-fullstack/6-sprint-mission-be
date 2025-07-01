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
const articleRepository_1 = __importDefault(require("../repositories/articleRepository"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const CustomError_1 = require("../utils/CustomError");
function formatArticleForList(article) {
    var _a, _b;
    if (!article)
        return null;
    return {
        id: article.id,
        title: article.title,
        content: article.content,
        image: article.image,
        writer: {
            id: article.writer.id,
            nickname: article.writer.nickname,
        },
        likeCount: ((_a = article._count) === null || _a === void 0 ? void 0 : _a.likedBy) || 0,
        commentCount: ((_b = article._count) === null || _b === void 0 ? void 0 : _b.comments) || 0,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
    };
}
function formatArticleForDetail(article, userId) {
    var _a, _b, _c;
    if (!article)
        return null;
    return {
        id: article.id,
        title: article.title,
        content: article.content,
        image: article.image,
        writer: {
            id: article.writer.id,
            nickname: article.writer.nickname,
            image: article.writer.image,
        },
        comments: ((_a = article.comments) === null || _a === void 0 ? void 0 : _a.map((comment) => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            writer: {
                id: comment.writer.id,
                nickname: comment.writer.nickname,
                image: comment.writer.image,
            },
        }))) || [],
        likeCount: ((_b = article._count) === null || _b === void 0 ? void 0 : _b.likedBy) || 0,
        commentCount: ((_c = article._count) === null || _c === void 0 ? void 0 : _c.comments) || 0,
        isLiked: userId && Array.isArray(article.likedBy)
            ? article.likedBy.some((like) => like.userId === userId)
            : false,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
    };
}
function createArticle(articleData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, content, writerId, image } = articleData;
        if (!title || title.trim() === "") {
            throw new CustomError_1.CustomError(422, "게시글 제목을 입력해주세요.");
        }
        if (!content || content.trim() === "") {
            throw new CustomError_1.CustomError(422, "게시글 내용을 입력해주세요.");
        }
        if (!writerId) {
            throw new CustomError_1.CustomError(400, "작성자 정보가 누락되었습니다.");
        }
        const writer = yield userRepository_1.default.findById(writerId);
        if (!writer) {
            throw new CustomError_1.CustomError(404, "게시글을 작성할 사용자를 찾을 수 없습니다.");
        }
        const createdArticle = yield articleRepository_1.default.create({
            title,
            content,
            image,
            writer: {
                connect: { id: writerId },
            },
        });
        const detailedArticle = yield articleRepository_1.default.findById(createdArticle.id, writerId);
        return formatArticleForDetail(detailedArticle, writerId);
    });
}
function getArticles(queryParams, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { page = "1", pageSize = "10", orderBy = "recent", keyword, } = queryParams;
        const skip = (parseInt(String(page), 10) - 1) * parseInt(String(pageSize), 10);
        const take = parseInt(String(pageSize), 10);
        const where = {};
        if (keyword) {
            where.OR = [
                { title: { contains: keyword, mode: "insensitive" } },
                { content: { contains: keyword, mode: "insensitive" } },
            ];
        }
        let prismaOrderBy = {};
        if (orderBy === "like") {
            prismaOrderBy = { likedBy: { _count: "desc" } };
        }
        else {
            prismaOrderBy = { createdAt: "desc" };
        }
        const { list, totalCount } = yield articleRepository_1.default.findAll({ skip, take, where, orderBy: prismaOrderBy }, userId);
        return {
            totalCount,
            list: list.map((article) => formatArticleForList(article)),
        };
    });
}
function getArticleById(articleId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const article = yield articleRepository_1.default.findById(articleId, userId);
        if (!article) {
            throw new CustomError_1.CustomError(404, "게시글을 찾을 수 없습니다.");
        }
        return formatArticleForDetail(article, userId);
    });
}
function updateArticle(articleId, updateData, writerId) {
    return __awaiter(this, void 0, void 0, function* () {
        const article = yield articleRepository_1.default.findById(articleId, writerId);
        if (!article) {
            throw new CustomError_1.CustomError(404, "수정할 게시글을 찾을 수 없습니다.");
        }
        if (article.writer.id !== writerId) {
            throw new CustomError_1.CustomError(403, "게시글을 수정할 권한이 없습니다.");
        }
        const { title, content, image } = updateData;
        const dataToUpdate = {};
        if (title !== undefined) {
            const trimmedTitle = title.trim();
            if (!trimmedTitle)
                throw new CustomError_1.CustomError(422, "제목은 공백일 수 없습니다.");
            dataToUpdate.title = trimmedTitle;
        }
        if (content !== undefined) {
            const trimmedContent = content.trim();
            if (!trimmedContent)
                throw new CustomError_1.CustomError(422, "내용은 공백일 수 없습니다.");
            dataToUpdate.content = trimmedContent;
        }
        if (image !== undefined) {
            dataToUpdate.image = image;
        }
        if (Object.keys(dataToUpdate).length === 0) {
            throw new CustomError_1.CustomError(422, "수정할 내용이 없습니다.");
        }
        yield articleRepository_1.default.update(articleId, dataToUpdate);
        const updatedArticle = yield articleRepository_1.default.findById(articleId, writerId);
        return formatArticleForDetail(updatedArticle, writerId);
    });
}
function deleteArticle(articleId, writerId) {
    return __awaiter(this, void 0, void 0, function* () {
        const article = yield articleRepository_1.default.findById(articleId, writerId);
        if (!article) {
            throw new CustomError_1.CustomError(404, "삭제할 게시글을 찾을 수 없습니다.");
        }
        if (article.writer.id !== writerId) {
            throw new CustomError_1.CustomError(403, "게시글을 삭제할 권한이 없습니다.");
        }
        yield articleRepository_1.default.deleteById(articleId);
    });
}
function likeArticle(articleId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const article = yield articleRepository_1.default.findById(articleId, userId);
        if (!article) {
            throw new CustomError_1.CustomError(404, "게시글을 찾을 수 없습니다.");
        }
        const existingLike = yield articleRepository_1.default.findLike(articleId, userId);
        if (existingLike) {
            return formatArticleForDetail(article, userId);
        }
        yield articleRepository_1.default.createLike(articleId, userId);
        const updatedArticle = yield articleRepository_1.default.findById(articleId, userId);
        if (!updatedArticle)
            throw new CustomError_1.CustomError(404, "업데이트된 게시글을 찾을 수 없습니다.");
        return formatArticleForDetail(updatedArticle, userId);
    });
}
function unlikeArticle(articleId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const article = yield articleRepository_1.default.findById(articleId, userId);
        if (!article) {
            throw new CustomError_1.CustomError(404, "게시글을 찾을 수 없습니다.");
        }
        const existingLike = yield articleRepository_1.default.findLike(articleId, userId);
        if (!existingLike) {
            return formatArticleForDetail(article, userId);
        }
        yield articleRepository_1.default.deleteLike(articleId, userId);
        const updatedArticle = yield articleRepository_1.default.findById(articleId, userId);
        if (!updatedArticle)
            throw new CustomError_1.CustomError(404, "업데이트된 게시글을 찾을 수 없습니다.");
        return formatArticleForDetail(updatedArticle, userId);
    });
}
exports.default = {
    createArticle,
    getArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
    likeArticle,
    unlikeArticle,
};
//# sourceMappingURL=articleService.js.map