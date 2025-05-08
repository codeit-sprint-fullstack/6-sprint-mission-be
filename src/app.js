const express = require("express");
const indexRouter = require("./modules/indexModule.js");

const app = express();
const PORT = 5050;

app.use(express.json());
app.use(indexRouter);

// 1. 저장 공간 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // 파일을 저장할 폴더 지정
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "." +
        file.originalname.split(".").pop()
    ); // "이름-날짜.확장자" 형식으로 저장
  },
});

// 2. 미들웨어 생성
const upload = multer({ storage: storage });

// 3. 라우트 설정
app.post("/upload", upload.single("userfile"), (req, res) => {
  console.log(req.file); // 업로드된 파일 정보 확인
  res.send("파일 업로드 성공!");
});

app.listen(PORT, () => {
  console.log(`포트 ${PORT} 서버 실행중...`);
});

// URL: http://localhost:5050/upload
// Method: POST
// Content-Type: multipart/form-data
// 데이터 형식: "userfile":"data"
