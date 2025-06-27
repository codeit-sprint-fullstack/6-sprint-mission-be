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
const client_prisma_1 = __importDefault(require("../config/client.prisma"));
function getById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client_prisma_1.default.comment.findUnique({
            where: { id },
        });
    });
}
function save(type, id, userId, content) {
    return __awaiter(this, void 0, void 0, function* () {
        if (type === "item") {
            return yield client_prisma_1.default.comment.create({
                data: {
                    content,
                    itemId: id,
                    userId: userId,
                },
            });
        }
        else {
            return yield client_prisma_1.default.comment.create({
                data: {
                    content: content,
                    articleId: id,
                    userId: userId,
                },
            });
        }
    });
}
function edit(id, comment) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client_prisma_1.default.comment.update({
            where: { id },
            data: {
                content: comment.content,
            },
        });
    });
}
function remove(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client_prisma_1.default.comment.delete({
            where: { id },
        });
    });
}
exports.default = {
    getById,
    remove,
    edit,
    save,
};
//# sourceMappingURL=commentRepository.js.map