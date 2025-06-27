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
const articleMocks_1 = require("./mocks/articleMocks");
const productMocks_1 = require("./mocks/productMocks");
const commentMocks_1 = require("./mocks/commentMocks");
const userMocks_1 = require("./mocks/userMocks");
const client_prisma_1 = __importDefault(require("../config/client.prisma"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const UserMocks = yield (0, userMocks_1.getUserMocks)();
        // 기존 데이터 삭제
        yield client_prisma_1.default.comment.deleteMany();
        yield client_prisma_1.default.user.deleteMany();
        yield client_prisma_1.default.article.deleteMany();
        yield client_prisma_1.default.product.deleteMany();
        // 목 데이터 삽입
        yield client_prisma_1.default.user.createMany({
            data: UserMocks,
            skipDuplicates: true,
        });
        yield client_prisma_1.default.article.createMany({
            data: articleMocks_1.ArticleMocks,
            skipDuplicates: true,
        });
        yield client_prisma_1.default.product.createMany({
            data: productMocks_1.ProductMocks,
            skipDuplicates: true,
        });
        yield client_prisma_1.default.comment.createMany({
            data: commentMocks_1.CommentMocks,
            skipDuplicates: true,
        });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield client_prisma_1.default.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield client_prisma_1.default.$disconnect();
    process.exit(1);
}));
//# sourceMappingURL=seed.js.map