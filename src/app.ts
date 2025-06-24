import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import morgan from "morgan";
import routes from "./routes/index";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// 정적 파일 제공
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 라우터 연결
app.use("/", routes);

// 에러 핸들러
app.use(errorHandler);

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
