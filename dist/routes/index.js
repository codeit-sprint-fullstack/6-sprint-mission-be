"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_js_1 = __importDefault(require("./auth.route.js"));
const product_route_js_1 = __importDefault(require("./product.route.js"));
const comment_route_js_1 = __importDefault(require("./comment.route.js"));
const image_route_js_1 = __importDefault(require("./image.route.js"));
const router = express_1.default.Router();
router.use("/auth", auth_route_js_1.default);
router.use("/products", product_route_js_1.default);
router.use("/products", comment_route_js_1.default);
router.use("/images", image_route_js_1.default);
exports.default = router;
