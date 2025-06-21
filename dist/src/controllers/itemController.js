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
const commentService_1 = __importDefault(require("../services/commentService"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const itemService_1 = __importDefault(require("../services/itemService"));
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("../middlewares/multer"));
const itemController = express_1.default.Router();
/**
 * @swagger
 * /items:
 *   get:
 *     summary: 상품 목록 조회
 *     tags: [Item]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 검색 키워드
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *         description: 정렬 기준
 *     responses:
 *       200:
 *         description: 상품 목록 반환
 */
itemController.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword, orderBy } = req.query;
        const items = yield itemService_1.default.getItems(keyword, orderBy);
        res.status(200).json(items);
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: 상품 상세 조회
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 상품 정보 반환
 */
itemController.get("/:id", auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
        const items = yield itemService_1.default.getById(id, userId);
        res.status(200).json(items);
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @swagger
 * /items:
 *   post:
 *     summary: 상품 등록
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: 상품 생성됨
 */
itemController.post("/", multer_1.default.array("images", 3), auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let { name, description, price, tags } = req.body;
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
        if (!name || !description || !price) {
            const error = new Error("모두 필요합니다.");
            error.code = 422;
            throw error;
        }
        price = Number(price);
        if (!tags) {
            tags = [];
        }
        else if (typeof tags === "string") {
            tags = JSON.parse(tags);
        }
        let imagePaths = [];
        const files = req.files;
        if (files.length > 0) {
            imagePaths = files.map((file) => `/uploads/${file.filename}`);
        }
        const item = yield itemService_1.default.createItem({
            name,
            description,
            price,
            tags,
            images: imagePaths,
            userId,
        });
        res.status(201).json(item);
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @swagger
 * /items/{id}:
 *   patch:
 *     summary: 상품 수정
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: 상품 수정 완료
 */
itemController.patch("/:id", auth_1.default.verifyAccessToken, multer_1.default.array("images", 3), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        let { name, description, price, tags } = req.body;
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
        const item = yield itemService_1.default.getById(id, userId);
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
        price = Number(price);
        if (!tags) {
            tags = [];
        }
        else if (typeof tags === "string") {
            tags = JSON.parse(tags);
        }
        let imagePaths = item.images;
        const files = req.files;
        if (files.length > 0) {
            imagePaths = files.map((file) => `/uploads/${file.filename}`);
        }
        const updatedItem = yield itemService_1.default.patchItem(id, {
            name,
            description,
            price,
            tags,
            images: imagePaths,
        });
        res.status(201).json(updatedItem);
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: 상품 삭제
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: 상품 삭제 완료
 */
itemController.delete("/:id", auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
        const item = yield itemService_1.default.getById(id, userId);
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
        yield itemService_1.default.deleteItem(id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @swagger
 * /items/{id}/comments:
 *   post:
 *     summary: 상품에 댓글 추가
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: 댓글 등록 완료
 */
itemController.post("/:id/comments", auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
/**
 * @swagger
 * /items/{id}/favorite:
 *   post:
 *     summary: 상품 좋아요 추가
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: 좋아요 추가됨
 */
itemController.post("/:id/favorite", auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
        const createdFavorite = yield itemService_1.default.postFavorite(id, userId);
        res.status(201).json(createdFavorite);
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @swagger
 * /items/{id}/favorite:
 *   delete:
 *     summary: 상품 좋아요 취소
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: 좋아요 취소됨
 */
itemController.delete("/:id/favorite", auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
        const deletedFavorite = yield itemService_1.default.deleteFavorite(id, userId);
        res.status(201).json(deletedFavorite);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = itemController;
//# sourceMappingURL=itemController.js.map