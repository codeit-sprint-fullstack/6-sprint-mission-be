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
const productRepository_1 = __importDefault(require("../repositories/productRepository"));
function create(product) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield productRepository_1.default.save(product);
    });
}
function getById(productId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield productRepository_1.default.getById(productId, userId);
        return product;
    });
}
function getAll(options) {
    return __awaiter(this, void 0, void 0, function* () {
        return productRepository_1.default.getAll(options);
    });
}
function update(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return productRepository_1.default.update(id, data);
    });
}
function deleteById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return productRepository_1.default.deleteById(id);
    });
}
function createProductComment(comment) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield productRepository_1.default.saveProductComment(comment);
    });
}
function getAllProductComment(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield productRepository_1.default.getAllProductComment(id);
    });
}
exports.default = {
    create,
    getById,
    getAll,
    update,
    deleteById,
    createProductComment,
    getAllProductComment,
};
//# sourceMappingURL=productService.js.map