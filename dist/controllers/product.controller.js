"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromFavorites = exports.addToFavorites = exports.deleteProductById = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const productService = __importStar(require("../services/product.service"));
exports.createProduct = (0, catchAsync_1.default)(async (req, res) => {
    const newProduct = await productService.createProduct(req.body, req.user.id);
    res.status(201).send(newProduct);
});
exports.getAllProducts = (0, catchAsync_1.default)(async (req, res) => {
    const products = await productService.getAllProducts();
    res.status(200).send(products);
});
exports.getProductById = (0, catchAsync_1.default)(async (req, res) => {
    const product = await productService.getProductById(parseInt(req.params.productId));
    if (!product) {
        return res.status(404).send({ message: 'Product not found' });
    }
    res.status(200).send(product);
});
exports.updateProduct = (0, catchAsync_1.default)(async (req, res) => {
    await productService.updateProduct(parseInt(req.params.productId), req.body);
    res.status(204).send('No Content');
});
exports.deleteProductById = (0, catchAsync_1.default)(async (req, res) => {
    await productService.deleteProductById(parseInt(req.params.productId));
    res.status(204).send('No Content');
});
exports.addToFavorites = (0, catchAsync_1.default)(async (req, res) => {
    res.send({ message: 'Added to favorites' });
});
exports.removeFromFavorites = (0, catchAsync_1.default)(async (req, res) => {
    res.status(204).send();
});
