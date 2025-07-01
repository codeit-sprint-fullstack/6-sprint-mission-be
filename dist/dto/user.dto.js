"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWithTokenSchema = exports.UserResponseSchema = void 0;
const zod_1 = require("zod");
exports.UserResponseSchema = zod_1.z.object({
    id: zod_1.z.number(),
    email: zod_1.z.string().email(),
    nickname: zod_1.z.string(),
});
exports.UserWithTokenSchema = zod_1.z.object({
    accessToken: zod_1.z.string(),
    user: exports.UserResponseSchema,
});
//# sourceMappingURL=user.dto.js.map