"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger"));
const userController_1 = __importDefault(require("./controllers/userController"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const itemController_1 = __importDefault(require("./controllers/itemController"));
const commentController_1 = __importDefault(require("./controllers/commentController"));
const articleController_1 = __importDefault(require("./controllers/articleController"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static("uploads"));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app.use("/articles", articleController_1.default);
app.use("/items", itemController_1.default);
app.use("/users", userController_1.default);
app.use("/comments", commentController_1.default);
app.use(errorHandler_1.default);
app.listen(process.env.PORT);
//# sourceMappingURL=app.js.map