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
const auth_1 = __importDefault(require("../middlewares/auth"));
const multer_1 = __importDefault(require("../middlewares/multer"));
const commentService_1 = __importDefault(require("../services/commentService"));
const articleController = express_1.default.Router();
articleController.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword, orderBy } = req.query;
        const articles = yield articleService_1.default.getArticles(keyword, orderBy);
        res.status(200).json(articles);
    }
    catch (error) {
        next(error);
    }
}));
articleController.get("/:id", auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
        const items = yield articleService_1.default.getById(id, userId);
        res.status(200).json(items);
    }
    catch (error) {
        next(error);
    }
}));
articleController.post("/", multer_1.default.array("images", 3), auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let { title, content } = req.body;
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
        if (!title || !content) {
            const error = new Error("모두 필요합니다.");
            error.code = 422;
            throw error;
        }
        let imagePaths = [];
        const files = req.files;
        if (files.length > 0) {
            imagePaths = files.map((file) => file.location);
        }
        const item = yield articleService_1.default.createArticle({
            title,
            content,
            images: imagePaths,
            userId,
        });
        res.status(201).json(item);
    }
    catch (error) {
        next(error);
    }
}));
articleController.get("/:id", auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
        const items = yield articleService_1.default.getById(id, userId);
        res.status(200).json(items);
    }
    catch (error) {
        next(error);
    }
}));
articleController.post("/", multer_1.default.array("images", 3), auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let { title, content } = req.body;
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
        if (!title || !content) {
            const error = new Error("모두 필요합니다.");
            error.code = 422;
            throw error;
        }
        let imagePaths = [];
        const files = req.files;
        if (files.length > 0) {
            imagePaths = files.map((file) => file.location);
        }
        const item = yield articleService_1.default.createArticle({
            title,
            content,
            images: imagePaths,
            userId,
        });
        res.status(201).json(item);
    }
    catch (error) {
        next(error);
    }
}));
articleController.patch("/:id", auth_1.default.verifyAccessToken, multer_1.default.array("images", 3), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        let { title, content } = req.body;
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
        const item = yield articleService_1.default.getById(id, userId);
        if (!item) {
            const error = new Error("수정하려는 물건이 존재하지 않습니다.");
            error.code = 422;
            throw error;
        }
        if (item.userId !== userId) {
            const error = new Error("권한이 없습니다.-작성자가 아닙니다.");
            error.code = 401;
            throw error;
        }
        let imagePaths = item.images;
        const files = req.files;
        if (files.length > 0) {
            imagePaths = files.map((file) => file.location);
        }
        const updatedItem = yield articleService_1.default.patchArticle(id, {
            title,
            content,
            images: imagePaths,
        });
        res.status(201).json(updatedItem);
    }
    catch (error) {
        next(error);
    }
}));
articleController.delete("/:id", auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
        const item = yield articleService_1.default.getById(id, userId);
        if (!item) {
            const error = new Error("삭제하려는 물건이 존재하지 않습니다.");
            error.code = 422;
            throw error;
        }
        if (item.userId !== userId) {
            const error = new Error("권한이 없습니다.-작성자가 아닙니다.");
            error.code = 401;
            throw error;
        }
        yield articleService_1.default.deleteArticle(id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}));
articleController.post("/:id/comments", auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        const { content } = req.body;
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
        if (!content) {
            const error = new Error("내용 필요합니다.");
            error.code = 422;
            throw error;
        }
        const type = "item";
        const comment = yield commentService_1.default.createComment(type, id, userId, content);
        res.status(201).json(comment);
    }
    catch (error) {
        next(error);
    }
}));
articleController.post("/:id/favorite", auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
        const createdFavorite = yield articleService_1.default.postFavorite(id, userId);
        res.status(201).json(createdFavorite);
    }
    catch (error) {
        next(error);
    }
}));
articleController.delete("/:id/favorite", auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
        const deletedFavorite = yield articleService_1.default.deleteFavorite(id, userId);
        res.status(201).json(deletedFavorite);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = articleController;
//# sourceMappingURL=articleController.js.map