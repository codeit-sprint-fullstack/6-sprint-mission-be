"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductQuerySchema = exports.ProductUpdateSchema = exports.ProductBodySchema = void 0;
const zod_1 = require("zod");
exports.ProductBodySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "상품 이름은 필수입니다."),
    description: zod_1.z.string().min(1, "상품 설명은 필수입니다."),
    price: zod_1.z.number().min(0, "가격은 0 이상이어야 합니다."),
    tags: zod_1.z.array(zod_1.z.string()),
    imageUrl: zod_1.z.string().url(),
    authorId: zod_1.z.number(),
});
exports.ProductUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().min(1).optional(),
    price: zod_1.z.number().min(0).optional(),
});
exports.ProductQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).optional().default(1),
    pageSize: zod_1.z.coerce.number().min(1).optional().default(10),
    orderBy: zod_1.z.enum(["recent", "favorite"]).optional().default("recent"),
    keyword: zod_1.z.string().optional().default(""),
});
//# sourceMappingURL=product.dto.js.map