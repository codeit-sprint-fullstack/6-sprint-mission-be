"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_js_1 = require("../controllers/product.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const optionalAuth_middleware_js_1 = require("../middlewares/optionalAuth.middleware.js");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
// 전체 상품 목록 조회
router.get("/", product_controller_js_1.getAllProducts);
// 상품 상세 조회 
router.get("/:productId", optionalAuth_middleware_js_1.optionalVerifyToken, product_controller_js_1.getProductById);
// 댓글 조회
router.get("/:productId/comments", product_controller_js_1.getProductComments);
// 상품 등록
router.post("/", auth_middleware_js_1.verifyToken, upload.none(), product_controller_js_1.createProduct);
// 상품 수정
router.patch("/:productId", auth_middleware_js_1.verifyToken, product_controller_js_1.updateProduct);
// 상품 삭제
router.delete("/:productId", auth_middleware_js_1.verifyToken, product_controller_js_1.deleteProduct);
// 상품 좋아요
router.post("/:productId/favorite", auth_middleware_js_1.verifyToken, product_controller_js_1.likeProduct);
// 좋아요 취소
router.delete("/:productId/favorite", auth_middleware_js_1.verifyToken, product_controller_js_1.unlikeProduct);
exports.default = router;
