"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.getAll = getAll;
exports.getById = getById;
exports.update = update;
exports.deleteById = deleteById;
const prismaClient_1 = __importDefault(require("../models/prisma/prismaClient"));
async function create(productData, userId) {
    const newProduct = await prismaClient_1.default.product.create({
        data: { ...productData, userId },
    });
    return newProduct;
}
async function getAll() {
    const products = await prismaClient_1.default.product.findMany();
    return products;
}
async function getById(productId) {
    const product = await prismaClient_1.default.product.findUnique({
        where: { id: productId },
    });
    return product;
}
async function update(productId, updateData) {
    const updatedProduct = await prismaClient_1.default.product.update({
        where: { id: productId },
        data: updateData,
    });
    return updatedProduct;
}
async function deleteById(productId) {
    const deletedProduct = await prismaClient_1.default.product.delete({
        where: { id: productId },
    });
    return deletedProduct;
}
