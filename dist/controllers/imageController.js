"use strict";
// src/controllers/imageController.ts
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
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../utils/asyncHandler");
const passport_1 = __importDefault(require("../config/passport"));
const CustomError_1 = require("../utils/CustomError");
const uploadMiddleware_1 = __importDefault(require("../middlewares/uploadMiddleware"));
const imageController = express_1.default.Router();
imageController.post("/upload", passport_1.default.authenticate("access-token", { session: false }), uploadMiddleware_1.default.array("image", 5), (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!files || !Array.isArray(files) || files.length === 0) {
        throw new CustomError_1.CustomError(400, "업로드할 이미지 파일들이 없습니다.");
    }
    if (!req.user || !req.user.id) {
        throw new CustomError_1.CustomError(401, "인증된 사용자만 이미지를 업로드할 수 있습니다.");
    }
    const uploaderId = req.user.id;
    res.status(201).json({
        message: "이미지들이 성공적으로 업로드되었습니다.",
        imageUrl: files.map((file) => file.location),
    });
})));
exports.default = imageController;
//# sourceMappingURL=imageController.js.map