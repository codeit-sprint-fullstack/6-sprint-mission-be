"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("./config/passport"));
const authController_1 = __importDefault(require("./controllers/authController"));
const userController_1 = __importDefault(require("./controllers/userController"));
const imageController_1 = __importDefault(require("./controllers/imageController"));
const productController_1 = __importDefault(require("./controllers/productController"));
const articleController_1 = __importDefault(require("./controllers/articleController"));
const commentController_1 = __importDefault(require("./controllers/commentController"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3001", // 프론트엔드 주소
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
app.use("/auth", authController_1.default);
app.use("/users", userController_1.default);
app.use("/products", productController_1.default);
app.use("/articles", articleController_1.default);
app.use("/uploads", express_1.default.static("uploads"));
app.use("/images", imageController_1.default);
app.use(commentController_1.default);
app.use(errorHandler_1.default);
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=app.js.map