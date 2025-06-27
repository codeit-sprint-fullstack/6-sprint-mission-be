import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

// 디스크 저장 엔진 설정
const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const uploadPath = path.resolve("uploads");

    // 업로드 폴더 없으면 생성
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    cb(null, uploadPath);
  },
  filename: (req: Request, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

// Multer 인스턴스 생성
const upload = multer({ storage });

export default upload;
