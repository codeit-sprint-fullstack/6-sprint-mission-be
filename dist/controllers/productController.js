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
const productService_js_1 = __importDefault(require("../services/productService.js"));
const varify_js_1 = __importDefault(require("../middlewares/varify.js"));
const auth_js_1 = __importDefault(require("../middlewares/auth.js"));
const images_1 = __importDefault(require("../middlewares/images"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_js_1 = require("../types/errors.js");
const productController = express_1.default.Router();
const productCommentController = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: 상품 및 상품 댓글 관련 API
 */
/**
 * @swagger
 * /products:
 *   post:
 *     summary: 상품 등록
 *     tags: [Products]
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
 *                 type: string
 *                 example: ["태그1", "태그2"]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 상품 등록 성공
 */
/**
 * @swagger
 * /products:
 *   get:
 *     summary: 전체 상품 목록 조회
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 페이지 번호
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [recent, favorite]
 *         description: 정렬 기준
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 상품 검색 키워드
 *     responses:
 *       200:
 *         description: 상품 목록 반환
 */
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: 상품 상세 조회
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 상품 정보 및 댓글 목록 반환
 *       404:
 *         description: 상품을 찾을 수 없음
 */
/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: 상품 수정
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: 수정된 상품 반환
 *       404:
 *         description: 상품을 찾을 수 없음
 */
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: 상품 삭제
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 삭제된 상품 정보 반환
 *       404:
 *         description: 상품을 찾을 수 없음
 */
/**
 * @swagger
 * /products/{id}/comments:
 *   post:
 *     summary: 상품에 댓글 등록
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *       200:
 *         description: 등록된 댓글 반환
 */
/**
 * @swagger
 * /products/{id}/comments:
 *   get:
 *     summary: 상품 댓글 조회
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 댓글 목록 반환
 */
// 상품 등록, 전체 상품 조회
productController
    .route("/")
    .post(auth_js_1.default.verifyAccessToken, images_1.default.single("image"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const parsedTags = (() => {
            try {
                const tags = JSON.parse(req.body.tags);
                return Array.isArray(tags) ? tags : [tags];
            }
            catch (e) {
                return [req.body.tags];
            }
        })();
        const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET_KEY);
        const userId = decoded.userId;
        const data = {
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            tags: parsedTags,
            imageUrl: req.file
                ? `http://localhost:3000/uploads/${req.file.filename}`
                : null,
            authorId: userId,
        };
        const createProduct = yield productService_js_1.default.create(data);
        res.json(createProduct);
    }
    catch (error) {
        next(error);
    }
}))
    .get((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, pageSize = 10, orderBy = "recent", keyword = "", } = req.query;
        const take = parseInt(pageSize);
        const skip = (parseInt(page) - 1) * take;
        const orderField = orderBy === "recent"
            ? "createdAt"
            : orderBy === "favorite"
                ? "favorite"
                : "createdAt";
        const validOrderOption = ["recent", "favorite"];
        if (!validOrderOption.includes(orderBy)) {
            res.status(400).json({ message: "잘못된  요청입니다." });
        }
        const product = yield productService_js_1.default.getAll({
            order: orderField,
            skip,
            take,
            keyword,
        });
        if (!product)
            varify_js_1.default.throwNotFoundError();
        res.json(product);
    }
    catch (error) {
        next(error);
    }
}));
//상품 상세 조회
productController.get("/:id", auth_js_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = Number(req.params.id);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const product = yield productService_js_1.default.getById(id, userId);
        if (!product)
            varify_js_1.default.throwNotFoundError();
        const productCommets = yield productService_js_1.default.getAllProductComment(id);
        res.json({ product, productCommets });
    }
    catch (error) {
        next(error);
    }
}));
//상품 수정, 삭제하기
productController
    .route("/:id")
    .all(auth_js_1.default.verifyAccessToken)
    .patch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = Number(req.params.id);
    const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET_KEY);
    try {
        const updatedProduct = yield productService_js_1.default.update(id, req.body);
        if (!updatedProduct)
            varify_js_1.default.throwNotFoundError();
        res.json(updatedProduct);
    }
    catch (error) {
        next(error);
    }
}))
    .delete((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    const deletedProduct = yield productService_js_1.default.deleteById(id);
    try {
        if (!deletedProduct) {
            throw new errors_js_1.NotFoundError("존재하지 않는 상품입니다.", 404);
        }
        res.json(deletedProduct);
    }
    catch (error) {
        next(error);
    }
}));
//상품에 댓글등록, 가져오기
productCommentController
    .route("/:id/comments")
    .post(auth_js_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.auth)
        throw new errors_js_1.AuthenticationError("사용자가 아닙니다.");
    const { userId } = req.auth;
    const id = Number(req.params.id);
    try {
        const createdComment = yield productService_js_1.default.createProductComment(Object.assign(Object.assign({}, req.body), { productId: id, authorId: userId }));
        res.json(createdComment);
    }
    catch (error) {
        next(error);
    }
}))
    .get((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const productComments = yield productService_js_1.default.getAllProductComment(id);
        res.json(productComments);
    }
    catch (error) {
        next(error);
    }
}));
//중복 컨트롤러 병합
productController.use("/", productCommentController);
exports.default = productController;
//# sourceMappingURL=productController.js.map