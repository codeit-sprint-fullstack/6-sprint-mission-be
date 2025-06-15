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
exports.unlikeProduct = exports.likeProduct = exports.getProductComments = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const client_js_1 = __importDefault(require("../db/prisma/client.js"));
// 전체 상품 목록 조회
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null;
        const products = yield client_js_1.default.product.findMany({
            include: {
                user: { select: { id: true, userName: true } },
                likes: true,
            },
            orderBy: { createdAt: "desc" },
        });
        const result = products.map((p) => (Object.assign(Object.assign({}, p), { favoriteCount: p.likes.length, isLiked: !!p.likes.find((l) => l.userId === userId), likes: undefined })));
        res.status(200).json({ list: result, totalCount: result.length });
    }
    catch (error) {
        console.error("상품 전체 조회 오류:", error);
        res.status(500).json({ message: "상품 목록 조회 실패" });
    }
});
exports.getAllProducts = getAllProducts;
// 상품 상세 조회
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const productId = parseInt(req.params.productId, 10);
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null;
        const product = yield client_js_1.default.product.findUnique({
            where: { id: productId },
            include: {
                user: { select: { id: true, userName: true } },
                likes: true,
            },
        });
        if (!product) {
            return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
        }
        const favoriteCount = product.likes.length;
        const isLiked = !!product.likes.find((l) => l.userId === userId);
        res.status(200).json(Object.assign(Object.assign({}, product), { favoriteCount,
            isLiked, likes: undefined }));
    }
    catch (error) {
        console.error("상품 상세 조회 오류:", error);
        res.status(500).json({ message: "상품 상세 조회 실패" });
    }
});
exports.getProductById = getProductById;
// 상품 등록
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, image, tags } = req.body;
        const tagArray = Array.isArray(tags) ? tags : [tags];
        const cleanedTags = tagArray.filter(Boolean);
        const newProduct = yield client_js_1.default.product.create({
            data: {
                name,
                description,
                price: parseInt(price, 10),
                image,
                userId: req.user.id,
                tags: cleanedTags,
            },
        });
        res.status(201).json({ message: "상품 등록 성공", product: newProduct });
    }
    catch (error) {
        console.error("상품 등록 오류:", error);
        res.status(500).json({ message: "상품 등록 실패" });
    }
});
exports.createProduct = createProduct;
// 상품 수정
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.productId);
        const { name, description, price, image } = req.body;
        const updated = yield client_js_1.default.product.update({
            where: { id: productId },
            data: { name, description, price, image },
        });
        res.status(200).json({ message: "상품 수정 성공", product: updated });
    }
    catch (error) {
        console.error("상품 수정 오류:", error);
        res.status(500).json({ message: "상품 수정 실패" });
    }
});
exports.updateProduct = updateProduct;
// 상품 삭제
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.productId);
        const userId = req.user.id;
        const product = yield client_js_1.default.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
        }
        if (product.userId !== userId) {
            return res.status(403).json({ message: "삭제 권한이 없습니다." });
        }
        yield client_js_1.default.comment.deleteMany({ where: { productId } });
        yield client_js_1.default.likeToProduct.deleteMany({ where: { productId } });
        yield client_js_1.default.product.delete({
            where: { id: productId },
        });
        res.status(200).json({ message: "상품 삭제 성공" });
    }
    catch (error) {
        console.error("상품 삭제 오류:", error);
        res.status(500).json({ message: "상품 삭제 실패" });
    }
});
exports.deleteProduct = deleteProduct;
// 상품 댓글 조회
const getProductComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.productId, 10);
        const limit = parseInt(req.query.limit) || 20;
        const comments = yield client_js_1.default.comment.findMany({
            where: { productId },
            orderBy: { createdAt: "desc" },
            take: limit,
            include: {
                writer: {
                    select: {
                        id: true,
                        userName: true,
                    },
                },
            },
        });
        res.status(200).json({ list: comments, totalCount: comments.length });
    }
    catch (error) {
        console.error("상품 댓글 조회 오류:", error);
        res.status(500).json({ message: "댓글 조회 실패" });
    }
});
exports.getProductComments = getProductComments;
// 좋아요
const likeProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.productId);
        const userId = req.user.id;
        const already = yield client_js_1.default.likeToProduct.findFirst({
            where: { productId, userId },
        });
        if (already) {
            return res.status(400).json({ message: "이미 좋아요를 눌렀습니다." });
        }
        const [like] = yield client_js_1.default.$transaction([
            client_js_1.default.likeToProduct.create({
                data: { productId, userId },
            }),
        ]);
        res.status(200).json({ message: "상품 좋아요 성공", like });
    }
    catch (error) {
        console.error("좋아요 오류:", error);
        res.status(500).json({ message: "좋아요 실패" });
    }
});
exports.likeProduct = likeProduct;
//  좋아요 취소
const unlikeProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.productId);
        const userId = req.user.id;
        yield client_js_1.default.$transaction([
            client_js_1.default.likeToProduct.deleteMany({
                where: { productId, userId },
            }),
        ]);
        res.status(200).json({ message: "좋아요 취소 성공" });
    }
    catch (error) {
        console.error("좋아요 취소 오류:", error);
        res.status(500).json({ message: "좋아요 취소 실패" });
    }
});
exports.unlikeProduct = unlikeProduct;
