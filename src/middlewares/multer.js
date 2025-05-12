import multer from "multer";
import path from "path";
import fs from "fs";

// 저장 위치 및 파일 이름 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve("uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`); 
  },
});

const upload = multer({ storage });

export default upload;
