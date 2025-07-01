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
const productRepository_1 = __importDefault(require("../repositories/productRepository"));
const CustomError_1 = require("../utils/CustomError");
function formatProductResponse(product, userId) {
    var _a;
    if (!product)
        return null;
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images || [],
        tags: product.tags || [],
        ownerId: product.owner.id,
        ownerNickname: product.owner.nickname,
        favoriteCount: ((_a = product._count) === null || _a === void 0 ? void 0 : _a.likedBy) || 0,
        createdAt: product.createdAt,
        isFavorite: userId && Array.isArray(product.likedBy)
            ? product.likedBy.some((like) => like.userId === userId)
            : false,
    };
}
function getProductById(productId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield productRepository_1.default.findById(productId, userId);
        if (!product) {
            throw new CustomError_1.CustomError(404, "상품을 찾을 수 없습니다.");
        }
        return formatProductResponse(product, userId);
    });
}
function createProduct(productData, ownerId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!productData.name || productData.price === undefined) {
            throw new CustomError_1.CustomError(422, "상품 이름과 가격은 필수입니다.");
        }
        if ((typeof productData.price !== "number" &&
            typeof productData.price !== "string") ||
            (typeof productData.price === "string" &&
                isNaN(parseInt(productData.price, 10))) ||
            (typeof productData.price === "number" && isNaN(productData.price)) ||
            Number(productData.price) < 0) {
            throw new CustomError_1.CustomError(422, "가격은 0 이상의 숫자여야 합니다.");
        }
        if (productData.tags && !Array.isArray(productData.tags)) {
            throw new CustomError_1.CustomError(422, "태그는 배열이어야 합니다.");
        }
        if (productData.images && !Array.isArray(productData.images)) {
            throw new CustomError_1.CustomError(422, "이미지는 URL 배열이어야 합니다.");
        }
        const createdProduct = yield productRepository_1.default.create({
            name: productData.name,
            price: productData.price,
            description: productData.description,
            tags: productData.tags,
            images: productData.images,
        }, ownerId);
        return formatProductResponse(createdProduct, ownerId);
    });
}
function getProducts(queryParams, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { page = 1, pageSize = 10, orderBy = "recent", keyword } = queryParams;
        const skip = (parseInt(String(page), 10) - 1) * parseInt(String(pageSize), 10);
        const take = parseInt(String(pageSize), 10);
        const where = {};
        if (keyword) {
            where.OR = [
                { name: { contains: keyword, mode: "insensitive" } },
                { description: { contains: keyword, mode: "insensitive" } },
                { tags: { has: keyword } },
            ];
        }
        let prismaOrderBy = {};
        if (orderBy === "favorite") {
            prismaOrderBy = { likedBy: { _count: "desc" } };
        }
        else {
            prismaOrderBy = { createdAt: "desc" };
        }
        const { list, totalCount } = yield productRepository_1.default.findAll({ skip, take, where, orderBy: prismaOrderBy }, userId);
        return {
            totalCount,
            list: list.map((product) => formatProductResponse(product, userId)),
        };
    });
}
function updateProduct(productId, updateData, requesterId) {
    return __awaiter(this, void 0, void 0, function* () {
        const productToUpdate = yield productRepository_1.default.findById(productId, requesterId);
        if (!productToUpdate) {
            throw new CustomError_1.CustomError(404, "수정할 상품을 찾을 수 없습니다.");
        }
        if (productToUpdate.owner.id !== requesterId) {
            throw new CustomError_1.CustomError(403, "상품을 수정할 권한이 없습니다.");
        }
        if (Object.keys(updateData).length === 0) {
            throw new CustomError_1.CustomError(400, "수정할 내용이 없습니다.");
        }
        if (updateData.price !== undefined &&
            ((typeof updateData.price !== "number" &&
                typeof updateData.price !== "string") ||
                (typeof updateData.price === "string" &&
                    isNaN(parseInt(updateData.price, 10))) ||
                (typeof updateData.price === "number" && isNaN(updateData.price)) ||
                Number(updateData.price) < 0)) {
            throw new CustomError_1.CustomError(422, "가격은 0 이상의 숫자여야 합니다.");
        }
        if (updateData.tags && !Array.isArray(updateData.tags)) {
            throw new CustomError_1.CustomError(422, "태그는 배열이어야 합니다.");
        }
        if (updateData.images && !Array.isArray(updateData.images)) {
            throw new CustomError_1.CustomError(422, "이미지는 URL 배열이어야 합니다.");
        }
        const updatedProductRaw = yield productRepository_1.default.update(productId, updateData);
        const finalProduct = yield productRepository_1.default.findById(productId, requesterId);
        return formatProductResponse(finalProduct, requesterId);
    });
}
function deleteProduct(productId, requesterId) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield productRepository_1.default.findById(productId);
        if (!product) {
            throw new CustomError_1.CustomError(404, "삭제할 상품을 찾을 수 없습니다.");
        }
        if (product.owner.id !== requesterId) {
            throw new CustomError_1.CustomError(403, "상품을 삭제할 권한이 없습니다.");
        }
        yield productRepository_1.default.deleteById(productId);
        return { id: parseInt(productId, 10) };
    });
}
function addFavorite(productId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield productRepository_1.default.findById(productId, userId);
        if (!product) {
            throw new CustomError_1.CustomError(404, "즐겨찾기할 상품을 찾을 수 없습니다.");
        }
        const existingLike = yield productRepository_1.default.findLike(productId, userId);
        if (existingLike) {
            return formatProductResponse(product, userId);
        }
        yield productRepository_1.default.createLike(productId, userId);
        const updatedProduct = yield productRepository_1.default.findById(productId, userId);
        return formatProductResponse(updatedProduct, userId);
    });
}
function removeFavorite(productId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield productRepository_1.default.findById(productId, userId);
        if (!product) {
            throw new CustomError_1.CustomError(404, "즐겨찾기에서 삭제할 상품을 찾을 수 없습니다.");
        }
        const existingLike = yield productRepository_1.default.findLike(productId, userId);
        if (!existingLike) {
            return formatProductResponse(product, userId);
        }
        yield productRepository_1.default.deleteLike(productId, userId);
        const updatedProduct = yield productRepository_1.default.findById(productId, userId);
        return formatProductResponse(updatedProduct, userId);
    });
}
exports.default = {
    getProductById,
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    addFavorite,
    removeFavorite,
};
//# sourceMappingURL=productService.js.map