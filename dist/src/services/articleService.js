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
function createArticle(article) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const createdArticle = yield articleRepository_1.default.save(article);
            return createdArticle;
        }
        catch (error) {
            throw error;
        }
    });
}
function getById(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield articleRepository_1.default.getById(id, userId);
    });
}
function getArticles(keyword, orderBy) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {};
        if (orderBy === "recent") {
            options.orderBy = { createdAt: "desc" };
        }
        else {
            options.orderBy = { favoriteCount: "desc" };
        }
        if (keyword) {
            options.where = {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                    { description: { contains: keyword, mode: "insensitive" } },
                ],
            };
        }
        return yield articleRepository_1.default.getByOptions(options);
    });
}
function patchArticle(id, article) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedArticle = yield articleRepository_1.default.edit(id, article);
            return updatedArticle;
        }
        catch (error) {
            throw error;
        }
    });
}
function deleteArticle(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deletedArticle = yield articleRepository_1.default.remove(id);
            return deletedArticle;
        }
        catch (error) {
            throw error;
        }
    });
}
function postFavorite(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const createdFavorite = yield articleRepository_1.default.createFavorite(id, userId);
            return createdFavorite;
        }
        catch (error) {
            throw error;
        }
    });
}
function deleteFavorite(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deletedFavorite = yield articleRepository_1.default.removeFavorite(id, userId);
            return deletedFavorite;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.default = {
    createArticle,
    getById,
    deleteArticle,
    getArticles,
    patchArticle,
    postFavorite,
    deleteFavorite,
};
//# sourceMappingURL=articleService.js.map