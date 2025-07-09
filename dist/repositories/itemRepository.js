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
        return yield client_prisma_1.default.item.findMany(options);
    });
}
function getById(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const item = yield client_prisma_1.default.item.findUnique({
            where: { id },
            include: {
                comments: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        const isFavorite = yield client_prisma_1.default.item.findFirst({
            where: {
                id,
                favoriteUsers: {
                    some: { id: userId },
                },
            },
        });
        return Object.assign(Object.assign({}, item), { isFavorite });
    });
}
function save(item) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client_prisma_1.default.item.create({
            data: {
                name: item.name,
                description: item.description,
                price: item.price,
                tags: item.tags,
                images: item.images,
                user: {
                    connect: {
                        id: item.userId,
                    },
                },
            },
        });
    });
}
function edit(id, item) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client_prisma_1.default.item.update({
            where: { id },
            data: {
                name: item.name,
                description: item.description,
                price: item.price,
                tags: item.tags,
                images: item.images,
            },
        });
    });
}
function remove(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client_prisma_1.default.item.delete({
            where: { id },
        });
    });
}
function createFavorite(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client_prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            const isFavorite = yield tx.item.findFirst({
                where: {
                    id,
                    favoriteUsers: {
                        some: { id: userId },
                    },
                },
            });
            if (isFavorite) {
                throw new Error("이미 즐겨찾기 목록에 추가된 아이템입니다.");
            }
            return yield tx.item.update({
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
            const isFavorite = yield tx.item.findFirst({
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
            return yield tx.item.update({
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
//# sourceMappingURL=itemRepository.js.map