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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const CustomError_1 = require("../utils/CustomError");
const JWT_SECRET_ENV = process.env.JWT_SECRET;
if (!JWT_SECRET_ENV) {
    throw new Error("JWT_SECRET is not defined in environment variables. Please set it.");
}
const JWT_SECRET = JWT_SECRET_ENV;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
function signUpUser(_a) {
    return __awaiter(this, arguments, void 0, function* ({ nickname, email, password, passwordConfirmation, }) {
        if (password !== passwordConfirmation) {
            throw new CustomError_1.CustomError(422, "비밀번호가 일치하지 않습니다.");
        }
        const existingUserByEmail = yield userRepository_1.default.findByEmail(email);
        if (existingUserByEmail) {
            throw new CustomError_1.CustomError(409, "이미 사용중인 이메일입니다.");
        }
        const existingUserByNickname = yield userRepository_1.default.findByNickname(nickname);
        if (existingUserByNickname) {
            throw new CustomError_1.CustomError(409, "이미 사용중인 닉네임입니다.");
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield userRepository_1.default.create({
            nickname,
            email,
            password: hashedPassword,
        });
        return newUser;
    });
}
function signInUser(email, passwordInput) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository_1.default.findByEmail(email);
        if (!user) {
            throw new CustomError_1.CustomError(401, "이메일 또는 비밀번호가 일치하지 않습니다.");
        }
        const isPasswordValid = yield bcrypt_1.default.compare(passwordInput, user.password);
        if (!isPasswordValid) {
            throw new CustomError_1.CustomError(401, "이메일 또는 비밀번호가 일치하지 않습니다.");
        }
        const payload = {
            userId: user.id,
            email: user.email,
            nickname: user.nickname,
        };
        const accessTokenOptions = {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        };
        const refreshTokenOptions = {
            expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, JWT_SECRET, accessTokenOptions);
        const refreshToken = jsonwebtoken_1.default.sign(payload, JWT_SECRET, refreshTokenOptions);
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        return { accessToken, refreshToken, user: userWithoutPassword };
    });
}
function generateNewAccessToken(user) {
    if (!user || !user.id || !user.email || !user.nickname) {
        throw new CustomError_1.CustomError(400, "새로운 액세스 토큰을 생성하기 위한 사용자 정보가 유효하지 않습니다.");
    }
    const payload = {
        userId: user.id,
        email: user.email,
        nickname: user.nickname,
    };
    const signOptions = {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, signOptions);
}
exports.default = {
    signUpUser,
    signInUser,
    generateNewAccessToken,
};
//# sourceMappingURL=authService.js.map