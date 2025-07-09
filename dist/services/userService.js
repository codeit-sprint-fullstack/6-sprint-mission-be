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
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function hashPassword(password) {
    return bcrypt_1.default.hash(password, 10);
}
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existedUser = yield userRepository_1.default.findByEmail(user.email);
            if (existedUser) {
                const error = new Error("사용 중인 이메일입니다.");
                error.code = 422;
                throw error;
            }
            const hashedPassword = yield hashPassword(user.password);
            const createdUser = yield userRepository_1.default.save(Object.assign(Object.assign({}, user), { password: hashedPassword }));
            return createdUser; //password랑 refreshtoken 제외해야함
        }
        catch (error) {
            throw error;
        }
    });
}
function verifyPassword(inputPassword, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const isMatch = yield bcrypt_1.default.compare(inputPassword, password);
        if (!isMatch) {
            const error = new Error("비밀번호가 일치하지 않습니다.");
            error.code = 401;
            throw error;
        }
    });
}
function getUser(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield userRepository_1.default.findByEmail(email);
            if (!user) {
                const error = new Error("존재하지 않는 이메일입니다.");
                error.code = 401;
                throw error;
            }
            yield verifyPassword(password, user.password);
            return user; //password랑 refreshtoken 제외해야함
        }
        catch (error) {
            throw error;
        }
    });
}
function createToken(user, type = "access") {
    const payload = { userId: user.id };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: type === "refresh" ? "2w" : "1h",
    });
    return token;
}
function refreshToken(userId, refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository_1.default.findById(userId);
        if (!user || user.refreshToken !== refreshToken) {
            const error = new Error("Unauthorized");
            error.code = 401;
            throw error;
        }
        const newAccessToken = createToken(user);
        const newRefreshToken = createToken(user, "refresh");
        //new refreshtoken db에 저장?
        return { newAccessToken, newRefreshToken };
    });
}
function getUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = userRepository_1.default.findById(userId);
        if (!user) {
            const error = new Error("Unauthorized");
            error.code = 401;
            throw error;
        }
        return user;
    });
}
exports.default = {
    createUser,
    getUser,
    createToken,
    refreshToken,
    getUserById,
};
//# sourceMappingURL=userService.js.map