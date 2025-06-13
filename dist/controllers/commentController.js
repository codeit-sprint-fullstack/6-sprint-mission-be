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
const auth_js_1 = __importDefault(require("../middlewares/auth.js"));
const commentService_js_1 = __importDefault(require("../services/commentService.js"));
const commentController = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: 댓글 관련 API
 */
/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: 댓글 수정
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 수정할 댓글 ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 댓글 수정 완료
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 댓글을 찾을 수 없음
 *
 *   delete:
 *     summary: 댓글 삭제
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 삭제할 댓글 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 댓글 삭제 완료
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 댓글을 찾을 수 없음
 */
commentController
    .route("/:id")
    .all(auth_js_1.default.varifyAccessToken, auth_js_1.default.verifyCommentAuth)
    .patch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const updatedComment = yield commentService_js_1.default.update(id, req.body);
        res.json(updatedComment);
    }
    catch (error) {
        next(error);
    }
}))
    .delete((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const deletedComment = yield commentService_js_1.default.deleteById(id);
        res.json(deletedComment);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = commentController;
//# sourceMappingURL=commentController.js.map