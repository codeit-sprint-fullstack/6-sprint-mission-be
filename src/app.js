import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { UnauthorizedError } from "express-jwt";

// 컨트롤러 연결
import userController from "./controllers/userController.js";
import productController from "./controllers/productController.js";
import productCommentController from "./controllers/productCommentController.js";
import favoriteController from "./controllers/favoriteController.js";
import uploadController from "./controllers/uploadController.js";

const app = express();
const port = process.env.PORT ?? 3000;

// app 설정
app.use(cookieParser());
app.use(express.json());

// 프론트에서 요청이 동작하기 위해 cors 적용
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

// 업로드 이미지 정적 경로
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 컨트롤러 연결
app.use("/api", uploadController);
app.use("/", userController);
app.use("/products", productController);
app.use("/", productCommentController);
app.use("/", favoriteController);

// express-jwt 인증 에러 핸들링
app.use((err, req, res, next) => {
  if (err instanceof UnauthorizedError) {
    console.error("JWT 인증 오류:", err.message);
    return res.status(401).json({ message: "인증이 유효하지 않습니다." });
  }
  next(err);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
