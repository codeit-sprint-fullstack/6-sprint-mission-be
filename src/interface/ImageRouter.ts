import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";
import path from "path";

import { asyncErrorHandler } from "./utils/asyncErrorHandler";
import { AuthN } from "./utils/AuthN";
import { BadRequestException } from "../exceptions/BadRequestException";

export const ImageRouter = express.Router();

// S3 설정 (환경변수 사용)
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const imageUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `images/${Date.now()}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    if (["image/png", "image/jpeg"].includes(file.mimetype) === false) {
      return cb(new Error("Only png and jpeg are allowed"));
    }
    cb(null, true);
  },
});

// 파일 업로드 API
ImageRouter.post(
  "/upload",
  AuthN(),
  imageUpload.single("image"),
  asyncErrorHandler(async (req, res) => {
    if (!req.file) {
      throw new BadRequestException("이미지 파일이 없습니다.");
    }

    // S3 업로드 결과 URL 반환
    // @ts-ignore
    const url = req.file.location;
    res.send({ url });
    return;
  })
);
