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
const express_jwt_1 = require("express-jwt");
const commentRepository_js_1 = __importDefault(require("../repositories/commentRepository.js"));
const errors_js_1 = require("../types/errors.js");
//인증된 사용자인지 검증
const verifyAccessToken = (0, express_jwt_1.expressjwt)({
    secret: process.env.JWT_SECRET_KEY,
    algorithms: ["HS256"],
});
//작성자만 UD 가능
function verifyCommentAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const commentId = Number(req.params.id);
        try {
            const comment = yield commentRepository_js_1.default.getById(commentId);
            if (!comment)
                throw new errors_js_1.NotFoundError("존재하지 않는 댓글입니다");
            if (!req.auth)
                throw new errors_js_1.NotFoundError("작성자를 찾을 수 없습니다.");
            if (comment.authorId !== req.auth.userId) {
                throw new errors_js_1.ForbiddenError("작성자만 권한이 있습니다");
            }
            next();
        }
        catch (error) {
            return next(error);
        }
    });
}
exports.default = {
    verifyAccessToken,
    verifyCommentAuth,
};
//# sourceMappingURL=auth.js.map