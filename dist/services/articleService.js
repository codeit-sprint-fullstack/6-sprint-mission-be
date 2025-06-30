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
function create(article) {
    return __awaiter(this, void 0, void 0, function* () {
        return articleRepository_1.default.save(article);
    });
}
function getById(articleId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return articleRepository_1.default.getById(articleId, userId);
    });
}
function getAll() {
    return __awaiter(this, void 0, void 0, function* () {
        return articleRepository_1.default.getAll();
    });
}
function update(id, review) {
    return __awaiter(this, void 0, void 0, function* () {
        return articleRepository_1.default.update(id, review);
    });
}
function deleteById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return articleRepository_1.default.deleteById(id);
    });
}
function createArticleComment(comment) {
    return __awaiter(this, void 0, void 0, function* () {
        return articleRepository_1.default.saveArticleComment(comment);
    });
}
function getAllArticleComment(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return articleRepository_1.default.getAllArticleComment(id);
    });
}
exports.default = {
    create,
    getById,
    getAll,
    update,
    deleteById,
    createArticleComment,
    getAllArticleComment,
};
//# sourceMappingURL=articleService.js.map