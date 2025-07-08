"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = express_1.default.Router();
router.post('/', auth_middleware_1.default, product_controller_1.createProduct);
router.get('/', product_controller_1.getAllProducts);
router.get('/:productId', product_controller_1.getProductById);
router.put('/:productId', auth_middleware_1.default, product_controller_1.updateProduct);
router.delete('/:productId', auth_middleware_1.default, product_controller_1.deleteProductById);
router.post('/:productId/favorite', auth_middleware_1.default, product_controller_1.addToFavorites);
router.delete('/:productId/favorite', auth_middleware_1.default, product_controller_1.removeFromFavorites);
exports.default = router;
