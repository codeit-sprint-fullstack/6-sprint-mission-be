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
const client_prisma_1 = __importDefault(require("../config/client.prisma"));
function addFavorite(productId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client_prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            const user = yield tx.user.findUnique({ where: { id: userId } });
            const product = yield tx.product.findUnique({ where: { id: productId } });
            if (!user || !product) {
                throw new Error("존재하지 않는 유저 또는 상품입니다.");
            }
            const existing = yield tx.favorite.findUnique({
                where: {
                    userId_productId: { userId, productId },
                },
            });
            if (existing) {
                throw new Error("이미 좋아요를 누른 상품입니다.");
            }
            yield tx.favorite.create({
                data: { userId: Number(userId), productId: Number(productId) },
            });
            return { isLiked: true };
        }));
    });
}
function removeFavorite(productId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client_prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            const existing = yield tx.favorite.findUnique({
                where: {
                    userId_productId: { userId, productId },
                },
            });
            if (!existing) {
                throw new Error("좋아요 상태가 아닙니다.");
            }
            yield tx.favorite.delete({
                where: { id: existing.id },
            });
            return { isLiked: false };
        }));
    });
}
function isProductLikedByUser(productId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const favorite = yield client_prisma_1.default.favorite.findUnique({
            where: { userId_productId: { userId, productId } },
        });
        return !!favorite;
    });
}
exports.default = {
    addFavorite,
    removeFavorite,
    isProductLikedByUser,
};
//# sourceMappingURL=favoriteRepository.js.map