import multer from "multer";
import { configDotenv } from "dotenv";
import s3 from "@/lib/s3Client";
import { Request } from "express";
const multerS3 = require("multer-s3");

configDotenv();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME!,
    // acl: "public-read",
    key: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, key?: string) => void
    ): void => {
      const isPrivate = req.query.access === "private";
      const folder = isPrivate ? "private/" : "panda-market/";
      const uniqueName = `${Date.now()}_${file.originalname}`;
      cb(null, `${folder}${uniqueName}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
});

export default upload;
