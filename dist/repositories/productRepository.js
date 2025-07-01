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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../config/prisma"));
// Helper for consistent selections
const _productOwnerSelection = {
    select: { id: true, nickname: true },
};
const _productCountSelection = { select: { likedBy: true } };
function findById(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield prisma_1.default.product.findUnique({
            where: {
                id: parseInt(id, 10),
            },
            include: {
                owner: _productOwnerSelection,
                likedBy: userId
                    ? {
                        where: { userId },
                        select: { userId: true },
                    }
                    : false,
                _count: _productCountSelection,
            },
        });
        // Prisma's return type with conditional includes can be tricky.
        // If likedBy is false, the property won't exist.
        // Casting might be necessary if GetPayload cannot fully represent this.
        return product;
    });
}
function create(productData, ownerId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, description, price, images, tags } = productData;
        return prisma_1.default.product.create({
            data: {
                name,
                description, // Now 'string', matching non-nullable schema expectation
                price: typeof price === "string" ? parseInt(price, 10) : price,
                images: images || [],
                owner: {
                    connect: { id: ownerId },
                },
                tags: tags || [],
            },
            include: {
                owner: _productOwnerSelection,
                _count: _productCountSelection,
            },
        });
    });
}
function findAll() {
    return __awaiter(this, arguments, void 0, function* (options = {}, userId) {
        const { skip, take = 10, where, orderBy = { createdAt: "desc" } } = options;
        const products = yield prisma_1.default.product.findMany({
            where,
            include: {
                owner: _productOwnerSelection,
                likedBy: userId ? { where: { userId }, select: { userId: true } } : false,
                _count: _productCountSelection,
            },
            orderBy,
            skip: skip !== undefined ? parseInt(String(skip), 10) : 0,
            take: parseInt(String(take), 10),
        });
        const totalCount = yield prisma_1.default.product.count({ where });
        return { list: products, totalCount };
    });
}
function update(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, description, price, images, tags } = data, otherData = __rest(data, ["name", "description", "price", "images", "tags"]);
        const finalUpdatePayload = Object.assign({}, otherData);
        if (name !== undefined)
            finalUpdatePayload.name = name;
        // description is now 'string | undefined'. If undefined, it's skipped.
        // If string, it's assigned. This is compatible with a non-nullable schema field.
        if (description !== undefined)
            finalUpdatePayload.description = description;
        if (price !== undefined && price !== null) {
            // price can be 0
            finalUpdatePayload.price =
                typeof price === "string" ? parseInt(price, 10) : price;
        }
        if (images !== undefined)
            finalUpdatePayload.images = images;
        if (tags !== undefined)
            finalUpdatePayload.tags = tags;
        return prisma_1.default.product.update({
            where: { id: parseInt(id, 10) },
            data: finalUpdatePayload,
            include: {
                owner: _productOwnerSelection,
                _count: _productCountSelection,
            },
        });
    });
}
function deleteById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.product.delete({
            where: { id: parseInt(id, 10) },
        });
    });
}
function findLike(productId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.productLike.findUnique({
            where: { userId_productId: { userId, productId: parseInt(productId, 10) } },
        });
    });
}
function createLike(productId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.productLike.create({
            data: { userId, productId: parseInt(productId, 10) },
        });
    });
}
function deleteLike(productId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.productLike.delete({
            where: { userId_productId: { userId, productId: parseInt(productId, 10) } },
        });
    });
}
exports.default = {
    findById,
    create,
    findAll,
    update,
    deleteById,
    findLike,
    createLike,
    deleteLike,
};
//# sourceMappingURL=productRepository.js.map