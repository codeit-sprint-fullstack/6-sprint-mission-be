"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const router = express_1.default.Router();
const mimeMap = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
};
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        let ext = path_1.default.extname(file.originalname);
        if (!ext || ext === "") {
            ext = mimeMap[file.mimetype] || ".jpg";
        }
        const name = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
        cb(null, name);
    },
});
const upload = (0, multer_1.default)({ storage });
router.post("/upload", auth_middleware_js_1.verifyToken, upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "파일이 업로드되지 않았습니다." });
    }
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.status(201).json({ url: imageUrl });
});
exports.default = router;
