import multer from 'multer';
import path from 'path';

// 저장될 디스크 스토리지 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 업로드된 이미지가 저장될 폴더
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // 파일 확장자 추출
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext); // 저장될 파일명 (원본이름-타임스탬프-랜덤값.확장자)
  },
});

// 파일 필터링 (이미지 파일만 허용)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(null, false); 
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 최대 파일 크기 5MB
});

export default upload;