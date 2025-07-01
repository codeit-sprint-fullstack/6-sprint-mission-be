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
const client_prisma_1 = __importDefault(require("../config/client.prisma"));
function save(article) {
    return __awaiter(this, void 0, void 0, function* () {
        const createArticle = yield client_prisma_1.default.article.create({
            data: {
                image: article.image,
                content: article.content,
                title: article.title,
            },
        });
        return createArticle;
    });
}
function getById(articleId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const article = yield client_prisma_1.default.article.findUnique({
            where: { id: articleId },
            include: {
                favorites: {
                    where: { userId },
                    select: { id: true },
                },
            },
        });
        if (!article)
            return null;
        return Object.assign(Object.assign({}, article), { isLiked: article.favorites.length > 0 });
    });
}
function getAll() {
    return __awaiter(this, void 0, void 0, function* () {
        const articles = yield client_prisma_1.default.article.findMany();
        return articles;
    });
}
function update(id, article) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedArticle = yield client_prisma_1.default.article.update({
            where: { id },
            data: {
                image: article.image,
                content: article.content,
                title: article.title,
            },
        });
        return updatedArticle;
    });
}
function deleteById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client_prisma_1.default.article.delete({
            where: {
                id,
            },
        });
    });
}
function saveArticleComment(comment) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client_prisma_1.default.comment.create({
            data: {
                content: comment.content,
                articleId: comment.articleId,
                authorId: comment.authorId,
            },
        });
    });
}
function getAllArticleComment(articleId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client_prisma_1.default.comment.findMany({
            where: {
                articleId: articleId,
            },
        });
    });
}
exports.default = {
    save,
    getById,
    getAll,
    update,
    deleteById,
    saveArticleComment,
    getAllArticleComment,
};
//# sourceMappingURL=articleRepository.js.map