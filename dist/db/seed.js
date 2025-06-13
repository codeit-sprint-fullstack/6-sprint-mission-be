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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const articleMocks_1 = require("./mocks/articleMocks");
const productMocks_1 = require("./mocks/productMocks");
const commentMocks_1 = require("./mocks/commentMocks");
const userMocks_1 = require("./mocks/userMocks");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const UserMocks = yield (0, userMocks_1.getUserMocks)();
        // 기존 데이터 삭제
        yield prisma.comment.deleteMany();
        yield prisma.user.deleteMany();
        yield prisma.article.deleteMany();
        yield prisma.product.deleteMany();
        // 목 데이터 삽입
        yield prisma.user.createMany({
            data: UserMocks,
            skipDuplicates: true,
        });
        yield prisma.article.createMany({
            data: articleMocks_1.ArticleMocks,
            skipDuplicates: true,
        });
        yield prisma.product.createMany({
            data: productMocks_1.ProductMocks,
            skipDuplicates: true,
        });
        yield prisma.comment.createMany({
            data: commentMocks_1.CommentMocks,
            skipDuplicates: true,
        });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
//# sourceMappingURL=seed.js.map