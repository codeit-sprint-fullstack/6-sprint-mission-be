import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

const uploadPath = 'uploads/';
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
    destination: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void,
    ) => {
        cb(null, uploadPath);
    },
    filename: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void,
    ) => {
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`; // ✅ 한글 이름 대신 UUID 사용
        cb(null, filename);
    },
});

const upload = multer({ storage });
export default upload;
