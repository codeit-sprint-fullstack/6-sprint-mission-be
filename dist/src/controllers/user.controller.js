"use strict";
// src/controllers/user.controller.ts (재확인)
// 이 파일에 RequestWithUser 인터페이스와 req as RequestWithUser가 적용되어 있어야 합니다.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyFavorites = exports.getMyProducts = exports.updatePassword = exports.updateMe = exports.getMe = void 0;
const prismaClient_1 = __importDefault(require("../models/prisma/prismaClient"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.getMe = (0, catchAsync_1.default)(async (req, res) => {
    const typedReq = req; // 이 부분이 있는지 확인
    res.send(typedReq.user);
});
exports.updateMe = (0, catchAsync_1.default)(async (req, res) => {
    const typedReq = req; // 이 부분이 있는지 확인
    const updatedUser = await prismaClient_1.default.user.update({
        where: { id: typedReq.user.id },
        data: typedReq.body,
    });
    res.send(updatedUser);
});
exports.updatePassword = (0, catchAsync_1.default)(async (req, res) => {
    res.send({ message: 'Password updated' });
});
exports.getMyProducts = (0, catchAsync_1.default)(async (req, res) => {
    const typedReq = req; // 이 부분이 있는지 확인
    const products = await prismaClient_1.default.product.findMany({
        where: { userId: typedReq.user.id },
    });
    res.send(products);
});
exports.getMyFavorites = (0, catchAsync_1.default)(async (req, res) => {
    res.send({ message: 'User favorites' });
});
