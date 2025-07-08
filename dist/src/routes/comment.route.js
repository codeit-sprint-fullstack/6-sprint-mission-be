"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("../controllers/comment.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = express_1.default.Router();
router.post('/products/:productId/comments', auth_middleware_1.default, comment_controller_1.createProductComment);
router.get('/products/:productId/comments', comment_controller_1.getProductComments);
router.patch('/comments/:commentId', auth_middleware_1.default, comment_controller_1.updateComment);
router.delete('/comments/:commentId', auth_middleware_1.default, comment_controller_1.deleteComment);
exports.default = router;
