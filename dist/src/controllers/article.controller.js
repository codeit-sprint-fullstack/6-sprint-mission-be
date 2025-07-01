"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikeArticle = exports.likeArticle = exports.deleteArticle = exports.updateArticle = exports.getArticleById = exports.getAllArticles = exports.createArticle = void 0;
const prismaClient_1 = __importDefault(require("../models/prisma/prismaClient"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.createArticle = (0, catchAsync_1.default)(async (req, res) => {
    const newArticle = await prismaClient_1.default.article.create({
        data: { ...req.body, userId: req.user.id },
    });
    res.status(201).send(newArticle);
});
exports.getAllArticles = (0, catchAsync_1.default)(async (req, res) => {
    const articles = await prismaClient_1.default.article.findMany();
    res.send(articles);
});
exports.getArticleById = (0, catchAsync_1.default)(async (req, res) => {
    const article = await prismaClient_1.default.article.findUnique({
        where: { id: parseInt(req.params.articleId) },
    });
    if (!article) {
        return res.status(404).send({ message: 'Article not found' });
    }
    res.send(article);
});
exports.updateArticle = (0, catchAsync_1.default)(async (req, res) => {
    const updatedArticle = await prismaClient_1.default.article.update({
        where: { id: parseInt(req.params.articleId) },
        data: req.body,
    });
    res.send(updatedArticle);
});
exports.deleteArticle = (0, catchAsync_1.default)(async (req, res) => {
    await prismaClient_1.default.article.delete({
        where: { id: parseInt(req.params.articleId) },
    });
    res.status(204).send();
});
exports.likeArticle = (0, catchAsync_1.default)(async (req, res) => {
    res.send({ message: 'Article liked' });
});
exports.unlikeArticle = (0, catchAsync_1.default)(async (req, res) => {
    res.status(204).send();
});
