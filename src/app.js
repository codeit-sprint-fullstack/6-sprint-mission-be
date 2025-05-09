// src/app.js
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../swagger.js");
const userRouter = require("./routes/user.route.js");
const productRouter = require("./routes/product.route.js");
const commentRouter = require("./routes/comment.route.js");
const authRouter = require("./routes/auth.route.js");
const articleRouter = require("./routes/article.route.js");
const imageRouter = require("./routes/image.route.js");
const {
  errorConverter,
  errorHandler,
} = require("./middlewares/error.middleware.js");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path"); // path 모듈 추가

const app = express();
const UPLOADS_DIR = "uploads/";

// 1. 저장 공간 설정 (multer)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR); // 파일을 저장할 폴더 지정
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname) // 확장자 추출
    ); // "이름-날짜.확장자" 형식으로 저장
  },
});

// 2. 미들웨어 생성 (multer)
const upload = multer({ storage: storage });

// 미들웨어
app.use(morgan("dev")); // 개발 환경 로깅
app.use(helmet()); // 보안 헤더 설정
app.use(cors()); // CORS 활성화
app.use(express.json()); // JSON 요청 body 파싱
app.use("/" + UPLOADS_DIR, express.static(UPLOADS_DIR)); // uploads 폴더를 정적 파일로 제공

// 라우터
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/comments", commentRouter);
app.use("/articles", articleRouter);
app.use("/images", imageRouter);

/**
 * @swagger
 * /images/upload:
 * post:
 * summary: Upload an image
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * multipart/form-data:
 * schema:
 * type: object
 * properties:
 * image:
 * type: string
 * format: binary
 * responses:
 * 200:
 * description: Successful upload
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * url:
 * type: string
 * example: "/uploads/image-1678886400000.png"
 * 400:
 * description: Bad Request
 * 401:
 * description: Unauthorized
 */
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No image file uploaded." });
  }
  const fileUrl = `/${UPLOADS_DIR}${req.file.filename}`;
  res.send({ url: fileUrl });
});

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 에러 처리 미들웨어
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
