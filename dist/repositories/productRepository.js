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
const client_1 = require("@prisma/client");
const client_prisma_js_1 = __importDefault(require("../config/client.prisma.js"));
const errors_js_1 = require("../types/errors.js");
function save(product) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client_prisma_js_1.default.product.create({
            data: {
                name: product.name,
                description: product.description,
                price: product.price,
                tags: product.tags,
                imageUrl: product.imageUrl,
                authorId: product.authorId,
            },
        });
    });
}
function getById(productId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield client_prisma_js_1.default.product.findUnique({
            where: { id: productId },
            include: {
                favorites: {
                    select: { id: true, userId: true },
                },
            },
        });
        if (!product)
            throw new errors_js_1.NotFoundError("해당 제품이 없습니다");
        const favoriteCounts = product.favorites.length;
        const isLiked = product.favorites.some((fav) => fav.userId === userId);
        return Object.assign(Object.assign({}, product), { favoriteCounts,
            isLiked });
    });
}
function getAll(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { order = "createdAt", skip = 0, take = 4, keyword = "" } = options;
        let orderByOption;
        if (order === "favorite") {
            orderByOption = {
                favorites: {
                    _count: client_1.Prisma.SortOrder.desc,
                },
            };
        }
        else {
            orderByOption = {
                createdAt: client_1.Prisma.SortOrder.desc,
            };
        }
        const products = yield client_prisma_js_1.default.product.findMany({
            where: {
                name: {
                    contains: keyword,
                    mode: "insensitive",
                },
            },
            orderBy: orderByOption,
            skip,
            take,
            include: {
                _count: {
                    select: { favorites: true },
                },
            },
        });
        return products;
    });
}
function update(productId, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedProduct = yield client_prisma_js_1.default.product.update({
            where: {
                id: productId,
            },
            data: {
                imageUrl: data.imageUrl,
                tags: data.tags,
                price: data.price,
                description: data.description,
                name: data.name,
            },
        });
        return updatedProduct;
    });
}
function deleteById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client_prisma_js_1.default.product.delete({
            where: { id },
        });
    });
}
function saveProductComment(comment) {
    return __awaiter(this, void 0, void 0, function* () {
        const createdComment = yield client_prisma_js_1.default.comment.create({
            data: {
                content: comment.content,
                productId: comment.productId,
                authorId: comment.authorId,
            },
        });
        return createdComment;
    });
}
function getAllProductComment(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const productComments = yield client_prisma_js_1.default.comment.findMany({
            where: {
                productId: id,
            },
        });
        return productComments;
    });
}
exports.default = {
    save,
    getById,
    getAll,
    update,
    deleteById,
    saveProductComment,
    getAllProductComment,
};
//# sourceMappingURL=productRepository.js.map