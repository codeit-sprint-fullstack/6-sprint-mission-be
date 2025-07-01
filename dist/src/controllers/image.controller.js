"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
// 이미지 업로드 관련 서비스 (예: AWS S3, 로컬 저장소) import
// import imageService from '../services/image.service';
exports.uploadImage = (0, catchAsync_1.default)(async (req, res) => {
    // 이미지 업로드 로직 구현 (multer 등의 미들웨어 필요할 수 있음)
    // const imageUrl = await imageService.upload(req.file);
    res.send({ imageUrl: '임시 이미지 URL' }); // 실제 구현 필요
});
