"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("./controllers/userController"));
const authController_1 = __importDefault(require("./controllers/authController"));
const articleController_1 = __importDefault(require("./controllers/articleController"));
const commentController_1 = __importDefault(require("./controllers/commentController"));
const productController_1 = __importDefault(require("./controllers/productController"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const favoriteController_js_1 = __importDefault(require("./controllers/favoriteController.js"));
const swagger_js_1 = require("./swagger.js");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const erroHandler_1 = require("./middlewares/erroHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3001",
        "https://6-sprint-mission-fe-git-next-sprint10-sukyoung-ks-projects.vercel.app",
    ],
    credentials: true,
}));
app.use("/uploads", express_1.default.static("uploads"));
app.use("/users/me", userController_1.default); //사용자 정보 컨트롤러
app.use("/auth", authController_1.default); //회원가입, 로그인 컨트롤러
app.use("/products", productController_1.default); //상품+댓글 컨토롤러
app.use("/articles", articleController_1.default); //게시글+댓글 컨트롤러
app.use("/comments", commentController_1.default); //댓글 컨트롤러
app.use("/favorites", favoriteController_js_1.default); //좋아요 컨트롤러
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_js_1.swaggerSpec));
app.use(erroHandler_1.errorHandler);
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started at ${PORT}...`);
    console.log("swagger 문서: http://localhost:3000/api-docs");
});
//# sourceMappingURL=app.js.map