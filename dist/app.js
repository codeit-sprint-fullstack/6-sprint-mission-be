"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger")); // './swagger.js'로 확장자 추가 필요 (CommonJS 환경이면 불필요)
const user_route_1 = __importDefault(require("./routes/user.route")); // './routes/user.route.js'
const product_route_1 = __importDefault(require("./routes/product.route")); // './routes/product.route.js'
const comment_route_1 = __importDefault(require("./routes/comment.route")); // './routes/comment.route.js'
const auth_route_1 = __importDefault(require("./routes/auth.route")); // './routes/auth.route.js'
const article_route_1 = __importDefault(require("./routes/article.route")); // './routes/article.route.js'
const image_route_1 = __importDefault(require("./routes/image.route")); // './routes/image.route.js'
const error_middleware_1 = require("./middlewares/error.middleware"); // './middlewares/error.middleware.js'
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const UPLOADS_DIR = "uploads/";
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage: storage });
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/" + UPLOADS_DIR, express_1.default.static(UPLOADS_DIR));
app.use("/auth", auth_route_1.default);
app.use("/users", user_route_1.default);
app.use("/products", product_route_1.default);
app.use("/comments", comment_route_1.default);
app.use("/articles", article_route_1.default);
app.use("/images", image_route_1.default);
app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        res.status(400).send({ message: "No image file uploaded." });
    }
    if (req.file) {
        const fileUrl = `/${UPLOADS_DIR}${req.file.filename}`;
        res.send({ url: fileUrl });
    }
    else {
        res.status(400).send({ message: "업로드된 파일이 없습니다." });
    }
});
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app.use(error_middleware_1.errorConverter);
app.use(error_middleware_1.errorHandler);
exports.default = app; // 앱 객체를 내보냅니다.
