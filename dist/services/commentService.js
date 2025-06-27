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
function createComment(type, id, userId, content) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const createdComment = yield commentRepository_1.default.save(type, id, userId, content);
            return createdComment;
        }
        catch (error) {
            throw error;
        }
    });
}
function getById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield commentRepository_1.default.getById(id);
    });
}
function patchComment(id, comment) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedComment = yield commentRepository_1.default.edit(id, comment);
            return updatedComment;
        }
        catch (error) {
            throw error;
        }
    });
}
function deleteComment(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deletedComment = yield commentRepository_1.default.remove(id);
            return deletedComment;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.default = {
    getById,
    patchComment,
    deleteComment,
    createComment,
};
//# sourceMappingURL=commentService.js.map