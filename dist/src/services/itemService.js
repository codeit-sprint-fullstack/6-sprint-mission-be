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
const itemRepository_1 = __importDefault(require("../repositories/itemRepository"));
function createItem(item) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const createdItem = yield itemRepository_1.default.save(item);
            return createdItem;
        }
        catch (error) {
            throw error;
        }
    });
}
function getById(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield itemRepository_1.default.getById(id, userId);
    });
}
function getItems(keyword, orderBy) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {};
        if (orderBy === "recent") {
            options.orderBy = { createdAt: "desc" };
        }
        else {
            options.orderBy = { favoriteCount: "desc" };
        }
        if (keyword) {
            options.where = {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                    { description: { contains: keyword, mode: "insensitive" } },
                ],
            };
        }
        return yield itemRepository_1.default.getByOptions(options);
    });
}
function patchItem(id, item) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedItem = yield itemRepository_1.default.edit(id, item);
            return updatedItem;
        }
        catch (error) {
            throw error;
        }
    });
}
function deleteItem(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deletedItem = yield itemRepository_1.default.remove(id);
            return deletedItem;
        }
        catch (error) {
            throw error;
        }
    });
}
function postFavorite(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const createdFavorite = yield itemRepository_1.default.createFavorite(id, userId);
            return createdFavorite;
        }
        catch (error) {
            throw error;
        }
    });
}
function deleteFavorite(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deletedFavorite = yield itemRepository_1.default.removeFavorite(id, userId);
            return deletedFavorite;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.default = {
    createItem,
    getById,
    deleteItem,
    getItems,
    patchItem,
    postFavorite,
    deleteFavorite,
};
//# sourceMappingURL=itemService.js.map