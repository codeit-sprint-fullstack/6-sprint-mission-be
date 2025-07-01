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
const express_1 = __importDefault(require("express"));
const authService_1 = __importDefault(require("../services/authService"));
const passport_1 = __importDefault(require("../config/passport"));
const asyncHandler_1 = require("../utils/asyncHandler");
const CustomError_1 = require("../utils/CustomError");
const authController = express_1.default.Router();
authController.post("/signup", (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nickname, email, password, passwordConfirmation } = req.body;
    if (!nickname || !email || !password || !passwordConfirmation) {
        throw new CustomError_1.CustomError(422, "닉네임, 이메일, 비밀번호, 비밀번호 확인은 필수입니다.");
    }
    const result = yield authService_1.default.signUpUser({
        nickname,
        email,
        password,
        passwordConfirmation,
    });
    res.status(201).json(result);
})));
authController.post("/signin", (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new CustomError_1.CustomError(422, "이메일과 비밀번호를 모두 입력해주세요.");
    }
    const { accessToken, refreshToken, user } = yield authService_1.default.signInUser(email, password);
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/",
        sameSite: "none",
        secure: true,
    });
    res.json({ accessToken, user });
})));
authController.post("/refresh-token", passport_1.default.authenticate("refresh-token", {
    session: false,
    failWithError: true,
}), (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new CustomError_1.CustomError(401, "토큰 갱신을 위한 사용자 정보가 없습니다.");
    }
    const user = req.user;
    const newAccessToken = authService_1.default.generateNewAccessToken(user);
    res.json({ accessToken: newAccessToken });
})));
exports.default = authController;
//# sourceMappingURL=authController.js.map