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
const favoriteService_js_1 = __importDefault(require("../services/favoriteService.js"));
const auth_js_1 = __importDefault(require("../middlewares/auth.js"));
const errors_js_1 = require("../types/errors.js");
const favoriteController = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: 좋아요 관련 API
 */
/**
 * @swagger
 * /favorites/product/{id}:
 *   post:
 *     summary: 상품 좋아요 등록
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 좋아요를 등록할 상품 ID
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: 상품 좋아요 완료
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 상품을 찾을 수 없음
 *
 *   delete:
 *     summary: 상품 좋아요 취소
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 좋아요를 취소할 상품 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 상품 좋아요 취소 완료
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 상품을 찾을 수 없음
 */
favoriteController
    .route("/product/:id")
    .all(auth_js_1.default.verifyAccessToken)
    .post((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.auth)
        throw new errors_js_1.AuthenticationError("작성자가 아닙니다");
    const userId = Number(req.auth.userId);
    const productId = Number(req.params.id);
    try {
        yield favoriteService_js_1.default.likeProduct(productId, userId);
        res.status(201).json({ message: "상품 좋아요 완료" });
    }
    catch (error) {
        next(error);
    }
}))
    .delete((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.auth)
        throw new errors_js_1.AuthenticationError("작성자가 아닙니다");
    const userId = Number(req.auth.userId);
    const productId = Number(req.params.id);
    try {
        yield favoriteService_js_1.default.unlikeProduct(productId, userId);
        res.status(200).json({ message: "상품 좋아요 취소 완료" });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = favoriteController;
//# sourceMappingURL=favoriteController.js.map