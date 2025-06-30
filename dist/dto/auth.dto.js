"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSchema = exports.CreateUserSchema = exports.SignInBodySchema = exports.SignUpBodySchema = void 0;
const zod_1 = require("zod");
exports.SignUpBodySchema = zod_1.z.object({
    email: zod_1.z.string().email("유효한 이메일 형식이 아닙니다."),
    nickname: zod_1.z.string().min(1, "닉네임은 필수입니다."),
    encryptedPassword: zod_1.z.string().min(4, "비밀번호는 4자 이상이어야합니다."),
});
exports.SignInBodySchema = zod_1.z.object({
    email: zod_1.z.string().email("유효한 이메일 형식이 아닙니다."),
    encryptedPassword: zod_1.z.string().min(4, "비밀번호는 4자 이상이어야합니다."),
});
exports.CreateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    nickname: zod_1.z.string().min(2),
    encryptedPassword: zod_1.z.string().min(1),
});
exports.EmailSchema = zod_1.z.string().email();
//# sourceMappingURL=auth.dto.js.map