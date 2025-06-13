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
const favoriteRepository_js_1 = __importDefault(require("../repositories/favoriteRepository.js"));
function likeProduct(productId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield favoriteRepository_js_1.default.addFavorite(productId, userId);
    });
}
function unlikeProduct(productId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield favoriteRepository_js_1.default.removeFavorite(productId, userId);
    });
}
function checkIsLiked(productId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield favoriteRepository_js_1.default.isProductLikedByUser(productId, userId);
    });
}
exports.default = {
    likeProduct,
    unlikeProduct,
    checkIsLiked,
};
//# sourceMappingURL=favoriteService.js.map