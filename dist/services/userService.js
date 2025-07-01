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
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const productRepository_1 = __importDefault(require("../repositories/productRepository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const CustomError_1 = require("../utils/CustomError");
function getUserProfile(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository_1.default.findById(userId);
        if (!user) {
            throw new CustomError_1.CustomError(404, "사용자를 찾을 수 없습니다.");
        }
        return user;
    });
}
function updateUserProfile(userId, updateData) {
    return __awaiter(this, void 0, void 0, function* () {
        const allowedUpdates = ["nickname", "image"];
        const filteredUpdateData = {};
        for (const key of allowedUpdates) {
            if (updateData[key] !== undefined) {
                const value = updateData[key];
                const valueToAssign = value === null ? undefined : value;
                filteredUpdateData[key] = valueToAssign;
            }
        }
        if (Object.keys(filteredUpdateData).length === 0) {
            throw new CustomError_1.CustomError(400, "수정할 유효한 정보가 없습니다.");
        }
        if (typeof filteredUpdateData.nickname === "string" &&
            filteredUpdateData.nickname) {
            const existingUserByNickname = yield userRepository_1.default.findByNickname(filteredUpdateData.nickname);
            if (existingUserByNickname && existingUserByNickname.id !== userId) {
                throw new CustomError_1.CustomError(409, "이미 사용중인 닉네임입니다.");
            }
        }
        const updatedUser = yield userRepository_1.default.update(userId, filteredUpdateData);
        return updatedUser;
    });
}
function updateUserPassword(userId, currentPassword, newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository_1.default.findByIdWithPassword(userId);
        if (!user) {
            throw new CustomError_1.CustomError(404, "사용자를 찾을 수 없습니다.");
        }
        const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new CustomError_1.CustomError(401, "현재 비밀번호가 일치하지 않습니다.");
        }
        if (newPassword.length < 8) {
            throw new CustomError_1.CustomError(422, "새 비밀번호는 최소 8자 이상이어야 합니다.");
        }
        if (currentPassword === newPassword) {
            throw new CustomError_1.CustomError(422, "새 비밀번호는 현재 비밀번호와 달라야 합니다.");
        }
        const hashedNewPassword = yield bcrypt_1.default.hash(newPassword, 10);
        yield userRepository_1.default.update(userId, {
            password: hashedNewPassword,
        });
    });
}
function getUserProducts(userId, queryParams) {
    return __awaiter(this, void 0, void 0, function* () {
        const prismaQueryParams = {
            where: { ownerId: userId },
        };
        if (queryParams.page && queryParams.pageSize) {
            prismaQueryParams.skip =
                (Number(queryParams.page) - 1) * Number(queryParams.pageSize);
            prismaQueryParams.take = Number(queryParams.pageSize);
        }
        return productRepository_1.default.findAll(prismaQueryParams, userId);
    });
}
function getUserFavorites(userId, queryParams) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            skip: queryParams.page && queryParams.pageSize
                ? (Number(queryParams.page) - 1) * Number(queryParams.pageSize)
                : undefined,
            take: queryParams.pageSize ? Number(queryParams.pageSize) : undefined,
        };
        const favoriteProducts = yield userRepository_1.default.findUserFavoriteProducts(userId, options);
        const favoriteArticles = yield userRepository_1.default.findUserFavoriteArticles(userId, options);
        return { products: favoriteProducts, articles: favoriteArticles };
    });
}
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository_1.default.findById(id);
        return user;
    });
}
exports.default = {
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    getUserProducts,
    getUserFavorites,
    getUserById,
};
//# sourceMappingURL=userService.js.map