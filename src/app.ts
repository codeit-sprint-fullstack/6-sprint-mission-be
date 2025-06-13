import express from "express";
import cors from "cors";
import "dotenv/config";
import errorHandler from "./middlewares/errorHandler";
import router from "./routes/indexRoutes";

const PORT = process.env.PORT || 3000;

// 서버 객체 생성
const app = express();

// JSON 파싱
app.use(express.json()); // json 데이터를 parsing.

// CORS 허용
app.use(
  cors({
    origin: [
      "https://been-panda.vercel.app",
      "https://been-panda.onrender.com",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
  })
);

// 서버 파일 제공
app.use("/images", express.static("uploads"));

// router 등록
app.use(router);

// 에러 핸들러
app.use(errorHandler);

// 서버 연결
app.listen(PORT, () => {
  console.log(`Server Started ${PORT}`);
});
