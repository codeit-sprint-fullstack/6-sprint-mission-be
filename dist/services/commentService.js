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
const commentRepository_1 = __importDefault(require("../repositories/commentRepository"));
const productRepository_1 = __importDefault(require("../repositories/productRepository"));
const articleRepository_1 = __importDefault(require("../repositories/articleRepository"));
const CustomError_1 = require("../utils/CustomError");
function createProductComment(productId, writerId, content) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!content || content.trim() === "") {
            throw new CustomError_1.CustomError(422, "댓글 내용을 입력해주세요.");
        }
        const product = yield productRepository_1.default.findById(productId);
        if (!product) {
            throw new CustomError_1.CustomError(404, "댓글을 작성할 상품을 찾을 수 없습니다.");
        }
        return commentRepository_1.default.create({
            content,
            writer: { connect: { id: writerId } },
            product: { connect: { id: parseInt(productId, 10) } },
        });
    });
}
function getProductComments(productId, queryParams) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield productRepository_1.default.findById(productId);
        if (!product) {
            throw new CustomError_1.CustomError(404, "상품을 찾을 수 없습니다.");
        }
        const page = queryParams.page ? parseInt(String(queryParams.page), 10) : 1;
        const pageSize = queryParams.pageSize
            ? parseInt(String(queryParams.pageSize), 10)
            : 10;
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        const commentList = yield commentRepository_1.default.findByProductId(parseInt(productId, 10), { skip, take });
        // NOTE: If commentRepository.findByProductId performs pagination,
        // commentList.length will be the count for the current page, not the total.
        return { list: commentList, totalCount: commentList.length };
    });
}
function createArticleComment(articleId, writerId, content) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!content || content.trim() === "") {
            throw new CustomError_1.CustomError(422, "댓글 내용을 입력해주세요.");
        }
        const article = yield articleRepository_1.default.findById(articleId);
        if (!article) {
            throw new CustomError_1.CustomError(404, "댓글을 작성할 게시글을 찾을 수 없습니다.");
        }
        return commentRepository_1.default.create({
            content,
            writer: { connect: { id: writerId } },
            article: { connect: { id: articleId } },
        });
    });
}
function getArticleComments(articleId, queryParams) {
    return __awaiter(this, void 0, void 0, function* () {
        const article = yield articleRepository_1.default.findById(articleId);
        if (!article) {
            throw new CustomError_1.CustomError(404, "게시글을 찾을 수 없습니다.");
        }
        const page = queryParams.page ? parseInt(String(queryParams.page), 10) : 1;
        const pageSize = queryParams.pageSize
            ? parseInt(String(queryParams.pageSize), 10)
            : 10;
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        const commentList = yield commentRepository_1.default.findByArticleId(articleId, {
            skip,
            take,
        });
        return { list: commentList, totalCount: commentList.length };
    });
}
function updateComment(commentId, content, writerId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!content || content.trim() === "") {
            throw new CustomError_1.CustomError(422, "댓글 내용을 입력해주세요.");
        }
        const comment = yield commentRepository_1.default.findById(commentId);
        if (!comment) {
            throw new CustomError_1.CustomError(404, "수정할 댓글을 찾을 수 없습니다.");
        }
        if (comment.writerId !== writerId) {
            throw new CustomError_1.CustomError(403, "댓글을 수정할 권한이 없습니다.");
        }
        return commentRepository_1.default.update(commentId, { content });
    });
}
function deleteComment(commentId, writerId) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = yield commentRepository_1.default.findById(commentId);
        if (!comment) {
            throw new CustomError_1.CustomError(404, "삭제할 댓글을 찾을 수 없습니다.");
        }
        if (comment.writerId !== writerId) {
            throw new CustomError_1.CustomError(403, "댓글을 삭제할 권한이 없습니다.");
        }
        yield commentRepository_1.default.deleteById(commentId);
    });
}
exports.default = {
    createProductComment,
    getProductComments,
    createArticleComment,
    getArticleComments,
    updateComment,
    deleteComment,
};
//# sourceMappingURL=commentService.js.map