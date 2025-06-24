import multer from "multer";

// 이미지 업로드
export const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 },
});
