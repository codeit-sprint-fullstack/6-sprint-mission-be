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
function getByOptions(options) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client_prisma_1.default.article.findMany(options);
    });
}
function getById(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const article = yield client_prisma_1.default.article.findUnique({
            where: { id },
            include: {
                comments: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        const isFavorite = yield client_prisma_1.default.article.findFirst({
            where: {
                id,
                favoriteUsers: {
                    some: { id: userId },
                },
            },
        });
        return Object.assign(Object.assign({}, article), { isFavorite });
    });
}
function save(article) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client_prisma_1.default.article.create({
            data: {
                title: article.title,
                content: article.content,
                images: article.images,
                user: {
                    connect: {
                        id: article.userId,
                    },
                },
            },
        });
    });
}
function edit(id, article) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client_prisma_1.default.article.update({
            where: { id },
            data: {
                title: article.title,
                content: article.content,
                images: article.images,
            },
        });
    });
}
function remove(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client_prisma_1.default.article.delete({
            where: { id },
        });
    });
}
function createFavorite(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client_prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            const isFavorite = yield tx.article.findFirst({
                where: {
                    id,
                    favoriteUsers: {
                        some: { id: userId },
                    },
                },
            });
            if (isFavorite) {
                throw new Error("이미 즐겨찾기 목록에 추가된 게시글입니다.");
            }
            return yield tx.article.update({
                where: { id },
                data: {
                    favoriteUsers: { connect: { id: userId } },
                    favoriteCount: {
                        increment: 1,
                    },
                },
            });
        }));
    });
}
function removeFavorite(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client_prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            const isFavorite = yield tx.article.findFirst({
                where: {
                    id,
                    favoriteUsers: {
                        some: { id: userId },
                    },
                },
            });
            if (!isFavorite) {
                throw new Error("이 아이템을 즐겨찾기에서 삭제할 수 없습니다.");
            }
            return yield tx.article.update({
                where: { id },
                data: {
                    favoriteUsers: { disconnect: { id: userId } },
                    favoriteCount: {
                        decrement: 1,
                    },
                },
            });
        }));
    });
}
exports.default = {
    getByOptions,
    getById,
    save,
    edit,
    remove,
    createFavorite,
    removeFavorite,
};
//# sourceMappingURL=articleRepository.js.map