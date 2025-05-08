// src/controllers/image.controller.js
const catchAsync = require("../utils/catchAsync.js");
// 이미지 업로드 관련 서비스 (예: AWS S3, 로컬 저장소) import
// const imageService = require('../services/image.service');

exports.uploadImage = catchAsync(async (req, res) => {
  // 이미지 업로드 로직 구현 (multer 등의 미들웨어 필요할 수 있음)
  // const imageUrl = await imageService.upload(req.file);
  res.send({ imageUrl: "임시 이미지 URL" }); // 실제 구현 필요
});
