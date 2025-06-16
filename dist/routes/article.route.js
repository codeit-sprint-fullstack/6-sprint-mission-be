"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const article_controller_1 = require("../controllers/article.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = express_1.default.Router();
router.post('/', auth_middleware_1.default, article_controller_1.createArticle);
router.get('/', article_controller_1.getAllArticles);
router.get('/:articleId', article_controller_1.getArticleById);
router.patch('/:articleId', auth_middleware_1.default, article_controller_1.updateArticle);
router.delete('/:articleId', auth_middleware_1.default, article_controller_1.deleteArticle);
router.post('/:articleId/like', auth_middleware_1.default, article_controller_1.likeArticle);
router.delete('/:articleId/like', auth_middleware_1.default, article_controller_1.unlikeArticle);
exports.default = router;
