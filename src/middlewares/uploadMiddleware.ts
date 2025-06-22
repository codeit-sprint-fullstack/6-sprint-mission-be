import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuid } from "uuid";

// 업로드 폴더 경로
const uploadPath = "uploads";

// 폴더 없으면 생성
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// multer 저장 방식 설정
const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = uuid(); // 고유 ID
    cb(null, `${uniqueName}${ext}`);
  },
});

// 실제 multer 미들웨어 생성
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB 제한
  },
});

export default upload;
