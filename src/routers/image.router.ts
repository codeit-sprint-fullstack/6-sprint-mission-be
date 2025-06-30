import express, { Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { verifyAccessToken } from "../middlewares/verifyToken";
import { S3Client } from "@aws-sdk/client-s3";

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
      cb(null, `public/${Date.now()}_${file.originalname}`);
    },
  }),
});

const imageRouter = express.Router();

imageRouter.post(
  "/upload",
  verifyAccessToken,
  upload.single("image"),
  (req: Request, res: Response) => {
    const file = req.file as Express.MulterS3.File;

    try {
      if (!req.file) {
        return;
      }

      res.status(201).json({
        url: file.location,
        key: file.key,
        originalname: file.originalname,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default imageRouter;
