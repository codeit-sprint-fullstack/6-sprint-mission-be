import express, { Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { verifyAccessToken } from "../middlewares/verifyToken";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME as string,
    key: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: any, key?: string) => void
    ) => {
      // ?access=private 인 경우 업로드 위치를 private/ 폴더로 지정
      const isPrivate = req.query.access === "private";
      const folder = isPrivate ? "private/" : "public/";
      cb(null, `${folder}${Date.now()}_${file.originalname}`);
    },
  }),
});

const imageRouter = express.Router();

imageRouter.post(
  "/upload",
  verifyAccessToken,
  upload.single("image"),
  async (req: Request, res: Response) => {
    const { location, key, originalname } = req.file as Express.MulterS3.File;
    const isPrivate = req.query.access === "private";

    try {
      if (!req.file) {
        return;
      }

      // private이면 presigned URL 생성
      let presignedUrl = null;
      if (isPrivate) {
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
        });
        presignedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); // 5분
      }

      res.status(201).json({
        url: location,
        key: key,
        originalname: originalname,
        presignedUrl,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default imageRouter;
