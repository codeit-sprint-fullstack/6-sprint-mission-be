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
const prisma_1 = __importDefault(require("../config/prisma"));
function create(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.user.create({
            data,
            select: {
                id: true,
                email: true,
                nickname: true,
                image: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    });
}
function findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                nickname: true,
                image: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    });
}
function findByIdWithPassword(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.user.findUnique({
            where: { id },
        });
    });
}
function findByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.user.findUnique({
            where: { email },
        });
    });
}
function findByNickname(nickname) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.user.findUnique({
            where: { nickname },
            select: {
                id: true,
                nickname: true,
            },
        });
    });
}
function update(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.user.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                nickname: true,
                image: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    });
}
function findUserFavoriteProducts(userId_1) {
    return __awaiter(this, arguments, void 0, function* (userId, options = {}) {
        const { skip, take } = options;
        return prisma_1.default.productLike.findMany({
            where: { userId },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        images: true,
                    },
                },
            },
            skip,
            take,
            orderBy: {
                createdAt: "desc",
            },
        });
    });
}
function findUserFavoriteArticles(userId_1) {
    return __awaiter(this, arguments, void 0, function* (userId, options = {}) {
        const { skip, take } = options;
        return prisma_1.default.articleLike.findMany({
            where: { userId },
            include: {
                article: {
                    select: {
                        id: true,
                        title: true,
                        image: true,
                    },
                },
            },
            skip,
            take,
            orderBy: {
                createdAt: "desc",
            },
        });
    });
}
exports.default = {
    create,
    findById,
    findByIdWithPassword,
    findByEmail,
    findByNickname,
    update,
    findUserFavoriteProducts,
    findUserFavoriteArticles,
};
//# sourceMappingURL=userRepository.js.map