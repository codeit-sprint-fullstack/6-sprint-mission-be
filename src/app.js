import express from "express";
import cors from "cors";
import "dotenv/config";
import handleError from "./middlewares/handleErrorMiddleware.js";
import router from "./routes/indexRoutes.js";

const PORT = process.env.PORT || 3000;

// 1. 서버 객체 생성
const app = express();

// 2. 미들웨어 등록
app.use(express.json()); // json 데이터를 parsing.
app.use(
  cors({
    origin: [
      "https://been-panda.vercel.app",
      "https://been-panda.onrender.com",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
  })
);

// 3. routes 등록
app.use(router);

// 4. 에러 미들웨어 등록
app.use(handleError);

// 5. 서버 연결
app.listen(PORT, () => {
  console.log(`Server Started ${PORT}`);
});
