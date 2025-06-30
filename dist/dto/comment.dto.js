"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentBodySchema = void 0;
const zod_1 = require("zod");
exports.CommentBodySchema = zod_1.z.object({
    content: zod_1.z.string().min(1, "댓글 내용은 필수입니다."),
});
//# sourceMappingURL=comment.dto.js.map