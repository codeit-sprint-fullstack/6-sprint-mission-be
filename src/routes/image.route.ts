import express, { Router, Request, Response, RequestHandler } from "express";
import multer from "multer";
import path from "path";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router: Router = express.Router();

const mimeMap: { [key: string]: string } = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (!ext || ext === "") {
      ext = mimeMap[file.mimetype] || ".jpg";
    }
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  },
});

const upload = multer({ storage });

router.post("/upload", verifyToken as unknown as RequestHandler, upload.single("file"), ((req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "파일이 업로드되지 않았습니다." });
  }

  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.status(201).json({ url: imageUrl });
}) as unknown as RequestHandler);

export default router; 