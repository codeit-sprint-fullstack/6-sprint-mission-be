"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = express_1.default.Router();
router.get('/me', auth_middleware_1.default, user_controller_1.getMe);
router.patch('/me', auth_middleware_1.default, user_controller_1.updateMe);
router.patch('/me/password', auth_middleware_1.default, user_controller_1.updatePassword);
router.get('/me/products', auth_middleware_1.default, user_controller_1.getMyProducts);
router.get('/me/favorites', auth_middleware_1.default, user_controller_1.getMyFavorites);
exports.default = router;
