"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckLikedResponseSchema = exports.FavoriteResponseSchema = exports.FavoriteParamSchema = exports.FavoriteIdSchema = void 0;
const zod_1 = require("zod");
exports.FavoriteIdSchema = zod_1.z.object({
    productId: zod_1.z.number().int().positive(),
    userId: zod_1.z.number().int().positive(),
});
exports.FavoriteParamSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().int().positive(), //강제로 숫자로 변환, 양의 정수인지 타입 체크
});
exports.FavoriteResponseSchema = zod_1.z.object({
    message: zod_1.z.string(),
});
exports.CheckLikedResponseSchema = zod_1.z.object({
    isLiked: zod_1.z.boolean(),
});
//# sourceMappingURL=favorite.dto.js.map