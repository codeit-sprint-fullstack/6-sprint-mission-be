"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlePatchSchema = exports.ArticleBodySchema = exports.IdParamSchema = void 0;
const zod_1 = require("zod");
exports.IdParamSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^\d+$/).transform(Number),
});
exports.ArticleBodySchema = zod_1.z
    .object({
    id: zod_1.z.number(),
    authorId: zod_1.z.string().regex(/^\d+$/).transform(Number),
    title: zod_1.z.string().min(1, "제목은 필수입니다."),
    content: zod_1.z.string().min(1, "내용은 필수입니다."),
    image: zod_1.z.string().url().or(zod_1.z.literal("")).optional(),
})
    .transform((data) => {
    var _a;
    return (Object.assign(Object.assign({}, data), { image: (_a = data.image) !== null && _a !== void 0 ? _a : "" }));
});
exports.ArticlePatchSchema = zod_1.z
    .object({
    title: zod_1.z.string().optional(),
    content: zod_1.z.string().optional(),
    image: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
})
    .refine((data) => data.title || data.content || data.image, {
    message: "수정할 값이 최소 하나 이상 필요합니다.",
});
//# sourceMappingURL=article.dto.js.map