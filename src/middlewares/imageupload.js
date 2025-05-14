import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid'; // 추가 설치 필요

const uploadPath = 'uploads/';
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`; // ✅ 한글 이름 대신 UUID 사용
        cb(null, filename);
    },
});

const upload = multer({ storage });
export default upload;
