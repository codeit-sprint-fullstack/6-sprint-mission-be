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
const favoriteRepository_1 = __importDefault(require("../repositories/favoriteRepository"));
const favorite_dto_1 = require("../dto/favorite.dto");
const errors_1 = require("../types/errors");
function likeProduct(productId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const parsed = favorite_dto_1.FavoriteIdSchema.safeParse({ productId, userId });
        if (!parsed.success)
            throw new errors_1.ValidationError("유효하지 않은 좋아요 요청입니다.");
        yield favoriteRepository_1.default.addFavorite(productId, userId);
        return { message: "상품 좋아요 완료" };
    });
}
function unlikeProduct(productId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const parsed = favorite_dto_1.FavoriteIdSchema.safeParse({ productId, userId });
        if (!parsed.success)
            throw new errors_1.ValidationError("유효하지 않은 좋아요 취소 요청입니다.");
        yield favoriteRepository_1.default.removeFavorite(productId, userId);
        return { message: "상품 좋아요 취소 완료" };
    });
}
function checkIsLiked(productId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const parsed = favorite_dto_1.FavoriteIdSchema.safeParse({ productId, userId });
        if (!parsed.success)
            throw new errors_1.ValidationError("유효하지 않은 좋아요 확인 요청입니다.");
        const isLiked = yield favoriteRepository_1.default.isProductLikedByUser(productId, userId);
        return { isLiked };
    });
}
exports.default = {
    likeProduct,
    unlikeProduct,
    checkIsLiked,
};
//# sourceMappingURL=favoriteService.js.map