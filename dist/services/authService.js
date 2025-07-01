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
const authRepository_1 = __importDefault(require("../repositories/authRepository"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_dto_1 = require("../dto/auth.dto");
const errors_1 = require("../types/errors");
function create(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const parsed = auth_dto_1.CreateUserSchema.safeParse(user);
        if (!parsed.success)
            throw new errors_1.ValidationError("형식이 유효하지 않습니다.");
        return yield authRepository_1.default.save(parsed.data);
    });
}
function createAccessToken(user) {
    const secretKey = `${process.env.JWT_SECRET_KEY}`;
    const payload = { userId: user };
    return jsonwebtoken_1.default.sign(payload, secretKey, {
        expiresIn: "1h",
    });
}
function createRefreshToken(user) {
    const secretKey = `${process.env.JWT_REFRESH_SECRET_KEY}`;
    const payload = { userId: user };
    return jsonwebtoken_1.default.sign(payload, secretKey, {
        expiresIn: "1h",
    });
}
function getByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const parsed = auth_dto_1.EmailSchema.safeParse(email);
        if (!parsed.success)
            throw new errors_1.ValidationError("잘못된 이메일 형식입니다.");
        return yield authRepository_1.default.findByEmail(parsed.data);
    });
}
exports.default = {
    create,
    createAccessToken,
    createRefreshToken,
    getByEmail,
};
//# sourceMappingURL=authService.js.map