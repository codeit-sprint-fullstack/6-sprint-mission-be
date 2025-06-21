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
const auth_js_1 = __importDefault(require("../middlewares/auth.js"));
const commentService_js_1 = __importDefault(require("../services/commentService.js"));
const express_1 = __importDefault(require("express"));
const commentController = express_1.default.Router();
/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: 댓글 수정
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 수정할 댓글의 ID
 *         required: true
 *         schema:
 *           type: string
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
 *                 description: 수정할 댓글 내용
 *     responses:
 *       201:
 *         description: 댓글 수정 완료
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       401:
 *         description: 권한 없음
 *       422:
 *         description: 댓글 존재하지 않음
 */
commentController.patch("/:id", auth_js_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        const { content } = req.body;
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
        const comment = yield commentService_js_1.default.getById(id);
        if (!comment) {
            const error = new Error("수정하려는 댓글이 존재하지 않습니다.");
            error.code = 422;
            throw error;
        }
        if (comment.userId !== userId) {
            const error = new Error("권한이 없습니다.-작성자가 아닙니다.");
            error.code = 401;
            throw error;
        }
        const updatedcomment = yield commentService_js_1.default.patchComment(id, { content });
        res.status(201).json(updatedcomment);
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: 댓글 삭제
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 삭제할 댓글의 ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: 댓글 삭제 성공
 *       401:
 *         description: 권한 없음
 *       422:
 *         description: 댓글 존재하지 않음
 */
commentController.delete("/:id", auth_js_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
        const comment = yield commentService_js_1.default.getById(id);
        if (!comment) {
            const error = new Error("삭제하려는 댓글이 존재하지 않습니다.");
            error.code = 422;
            throw error;
        }
        if (comment.userId !== userId) {
            const error = new Error("권한이 없습니다.-작성자가 아닙니다.");
            error.code = 401;
            throw error;
        }
        yield commentService_js_1.default.deleteComment(id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}));
exports.default = commentController;
//# sourceMappingURL=commentController.js.map