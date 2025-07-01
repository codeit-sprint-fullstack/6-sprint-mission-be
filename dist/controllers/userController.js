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
const userService_1 = __importDefault(require("../services/userService"));
const passport_1 = __importDefault(require("../config/passport"));
const asyncHandler_1 = require("../utils/asyncHandler");
const CustomError_1 = require("../utils/CustomError");
const userController = express_1.default.Router();
// GET /users/me - 현재 로그인된 사용자 정보 조회
userController.get("/me", passport_1.default.authenticate("access-token", {
    session: false,
    failWithError: true,
}), (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new CustomError_1.CustomError(401, "인증되지 않은 사용자이거나 사용자 ID가 없습니다.");
    }
    const userId = req.user.id;
    const userProfile = yield userService_1.default.getUserProfile(userId);
    res.json(userProfile);
})));
// PATCH /users/me - 현재 로그인된 사용자 정보 수정 (닉네임, 프로필 이미지 등)
userController.patch("/me", passport_1.default.authenticate("access-token", {
    session: false,
    failWithError: true,
}), (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new CustomError_1.CustomError(401, "인증되지 않은 사용자이거나 사용자 ID가 없습니다.");
    }
    const userId = req.user.id;
    const updateData = req.body;
    if (Object.keys(updateData).length === 0) {
        throw new CustomError_1.CustomError(400, "수정할 내용이 없습니다.");
    }
    const updatedUser = yield userService_1.default.updateUserProfile(userId, updateData);
    res.json(updatedUser);
})));
// PATCH /users/me/password - 현재 로그인된 사용자 비밀번호 변경
userController.patch("/me/password", passport_1.default.authenticate("access-token", {
    session: false,
    failWithError: true,
}), (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new CustomError_1.CustomError(401, "인증되지 않은 사용자이거나 사용자 ID가 없습니다.");
    }
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        throw new CustomError_1.CustomError(422, "현재 비밀번호와 새 비밀번호를 모두 입력해야 합니다.");
    }
    yield userService_1.default.updateUserPassword(userId, currentPassword, newPassword);
    res.json({ message: "비밀번호가 성공적으로 변경되었습니다." });
})));
// GET /users/me/products - 현재 로그인된 사용자가 등록한 상품 목록 조회
userController.get("/me/products", passport_1.default.authenticate("access-token", {
    session: false,
    failWithError: true,
}), (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new CustomError_1.CustomError(401, "인증되지 않은 사용자이거나 사용자 ID가 없습니다.");
    }
    const userId = req.user.id;
    const products = yield userService_1.default.getUserProducts(userId, req.query);
    res.json(products);
})));
// GET /users/me/favorites - 현재 로그인된 사용자가 즐겨찾기한 상품 및 게시글 목록 조회
userController.get("/me/favorites", passport_1.default.authenticate("access-token", {
    session: false,
    failWithError: true,
}), (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new CustomError_1.CustomError(401, "인증되지 않은 사용자이거나 사용자 ID가 없습니다.");
    }
    const userId = req.user.id;
    const favorites = yield userService_1.default.getUserFavorites(userId, req.query);
    res.json(favorites);
})));
exports.default = userController;
//# sourceMappingURL=userController.js.map