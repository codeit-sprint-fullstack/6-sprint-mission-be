import { ValidationError } from "@/types/errors";
import express, { Request, Response } from "express";
import multer, { StorageEngine } from "multer";
import path from "path";

const uploadController = express.Router();

// 저장 방식
const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// 단일 이미지 업로드 (image 필드 이름으로 전송)
uploadController.post(
  "/upload",
  upload.single("image"),
  (req: Request, res: Response) => {
    if (!req.file) {
      throw new ValidationError("이미지 파일이 없습니다.");
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ url: imageUrl });
  }
);

export default uploadController;
