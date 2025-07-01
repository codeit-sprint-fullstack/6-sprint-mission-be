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
const prisma_1 = __importDefault(require("../config/prisma"));
const _writerSelection = {
    select: {
        id: true,
        nickname: true,
        image: true,
    },
};
const _countSelection = {
    select: { likedBy: true, comments: true },
};
function create(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.article.create({
            data,
            include: {
                writer: _writerSelection,
                _count: _countSelection,
            },
        });
    });
}
function findAll() {
    return __awaiter(this, arguments, void 0, function* (options = {}, userId) {
        const { skip, take = 10, where, orderBy = { createdAt: "desc" } } = options;
        const articles = yield prisma_1.default.article.findMany({
            where,
            include: {
                writer: _writerSelection,
                _count: _countSelection,
            },
            orderBy,
            skip: skip !== undefined ? parseInt(String(skip), 10) : 0,
            take: take !== undefined ? parseInt(String(take), 10) : 10,
        });
        const totalCount = yield prisma_1.default.article.count({ where });
        const listWithIsLiked = articles.map((article) => {
            const likedByArray = article.likedBy;
            const isLiked = userId && Array.isArray(likedByArray)
                ? likedByArray.some((like) => like.userId === userId)
                : false;
            return Object.assign(Object.assign({}, article), { isLiked });
        });
        return { list: listWithIsLiked, totalCount };
    });
}
function findById(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.article.findUnique({
            where: { id },
            include: {
                writer: _writerSelection,
                comments: {
                    orderBy: { createdAt: "desc" },
                    take: 5,
                    include: {
                        writer: _writerSelection,
                    },
                },
                likedBy: userId
                    ? {
                        where: { userId },
                        select: { userId: true },
                    }
                    : false,
                _count: _countSelection,
            },
        });
    });
}
function update(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.article.update({
            where: { id },
            data,
            include: {
                writer: _writerSelection,
                _count: _countSelection,
            },
        });
    });
}
function deleteById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.article.delete({
            where: { id },
        });
    });
}
function findLike(articleId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.articleLike.findUnique({
            where: {
                userId_articleId: {
                    userId,
                    articleId,
                },
            },
        });
    });
}
function createLike(articleId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.articleLike.create({
            data: {
                articleId,
                userId,
            },
        });
    });
}
function deleteLike(articleId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.articleLike.delete({
            where: {
                userId_articleId: {
                    userId,
                    articleId,
                },
            },
        });
    });
}
exports.default = {
    create,
    findAll,
    findById,
    update,
    deleteById,
    findLike,
    createLike,
    deleteLike,
};
//# sourceMappingURL=articleRepository.js.map