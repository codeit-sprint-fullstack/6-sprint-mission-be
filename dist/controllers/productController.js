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
const passport_1 = __importDefault(require("../config/passport"));
const productService_1 = __importDefault(require("../services/productService"));
const asyncHandler_1 = require("../utils/asyncHandler");
const CustomError_1 = require("../utils/CustomError");
const productController = express_1.default.Router();
productController.post("/", passport_1.default.authenticate("access-token", {
    session: false,
    failWithError: true,
}), (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new CustomError_1.CustomError(401, "인증되지 않은 사용자이거나 사용자 ID가 없습니다.");
    }
    const ownerId = req.user.id;
    if (!req.body.name || req.body.price === undefined) {
        throw new CustomError_1.CustomError(422, "상품 이름과 가격은 필수입니다.");
    }
    const createdProduct = yield productService_1.default.createProduct(req.body, ownerId);
    res.status(201).json(createdProduct);
})));
productController.get("/", (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const products = yield productService_1.default.getProducts(req.query, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    res.json(products);
})));
productController.get("/:productId", (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { productId } = req.params;
    const product = yield productService_1.default.getProductById(productId, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    res.json(product);
})));
productController.patch("/:productId", passport_1.default.authenticate("access-token", {
    session: false,
    failWithError: true,
}), (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    if (!req.user || !req.user.id) {
        throw new CustomError_1.CustomError(401, "인증되지 않은 사용자이거나 사용자 ID가 없습니다.");
    }
    const requesterId = req.user.id;
    const updateData = req.body;
    if (Object.keys(updateData).length === 0) {
        throw new CustomError_1.CustomError(400, "수정할 내용이 없습니다.");
    }
    const updatedProduct = yield productService_1.default.updateProduct(productId, updateData, requesterId);
    res.json(updatedProduct);
})));
productController.delete("/:productId", passport_1.default.authenticate("access-token", {
    session: false,
    failWithError: true,
}), (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    if (!req.user || !req.user.id) {
        throw new CustomError_1.CustomError(401, "인증되지 않은 사용자이거나 사용자 ID가 없습니다.");
    }
    const requesterId = req.user.id;
    yield productService_1.default.deleteProduct(productId, requesterId);
    res.status(204).send();
})));
productController.post("/:productId/favorite", passport_1.default.authenticate("access-token", {
    session: false,
    failWithError: true,
}), (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    if (!req.user || !req.user.id) {
        throw new CustomError_1.CustomError(401, "인증되지 않은 사용자이거나 사용자 ID가 없습니다.");
    }
    const userId = req.user.id;
    const result = yield productService_1.default.addFavorite(productId, userId);
    res
        .status(201)
        .json({ message: "상품을 즐겨찾기에 추가했습니다.", data: result });
})));
productController.delete("/:productId/favorite", passport_1.default.authenticate("access-token", {
    session: false,
    failWithError: true,
}), (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    if (!req.user || !req.user.id) {
        throw new CustomError_1.CustomError(401, "인증되지 않은 사용자이거나 사용자 ID가 없습니다.");
    }
    const userId = req.user.id;
    yield productService_1.default.removeFavorite(productId, userId);
    res.status(200).json({ message: "상품 즐겨찾기를 삭제했습니다." });
})));
exports.default = productController;
//# sourceMappingURL=productController.js.map