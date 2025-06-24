"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyFavorites = exports.getMyProducts = exports.updatePassword = exports.updateMe = exports.getMe = void 0;
const prismaClient_1 = __importDefault(require("../models/prisma/prismaClient"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.getMe = (0, catchAsync_1.default)(async (req, res) => {
    res.send(req.user);
});
exports.updateMe = (0, catchAsync_1.default)(async (req, res) => {
    const updatedUser = await prismaClient_1.default.user.update({
        where: { id: req.user.id },
        data: req.body,
    });
    res.send(updatedUser);
});
exports.updatePassword = (0, catchAsync_1.default)(async (req, res) => {
    res.send({ message: 'Password updated' });
});
exports.getMyProducts = (0, catchAsync_1.default)(async (req, res) => {
    const products = await prismaClient_1.default.product.findMany({
        where: { userId: req.user.id },
    });
    res.send(products);
});
exports.getMyFavorites = (0, catchAsync_1.default)(async (req, res) => {
    res.send({ message: 'User favorites' });
});
