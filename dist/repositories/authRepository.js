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
const client_prisma_js_1 = __importDefault(require("../config/client.prisma.js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function save(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = yield bcrypt_1.default.hash(user.encryptedPassword, 10);
        return yield client_prisma_js_1.default.user.create({
            data: {
                email: user.email,
                nickname: user.nickname,
                image: user.image,
                encryptedPassword: hashedPassword,
            },
        });
    });
}
function findByEmail(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, encryptedPassword } = user;
        const getUser = yield client_prisma_js_1.default.user.findUnique({
            where: { email },
        });
        if (!getUser)
            throw new Error("존재하지 않는 유저입니다.");
        if (!getUser || !encryptedPassword || !getUser.encryptedPassword) {
            throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
        }
        const isMatched = yield bcrypt_1.default.compare(encryptedPassword, getUser.encryptedPassword);
        if (!isMatched)
            throw new Error("비밀번호가 일치하지 않습니다.");
        return getUser;
    });
}
exports.default = {
    save,
    findByEmail,
};
//# sourceMappingURL=authRepository.js.map