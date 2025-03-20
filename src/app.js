import express from "express";
import cors from "cors";
import "dotenv/config";
import handleError from "./middlewares/handleErrorMiddleware.js";
import router from "./routes/indexRoutes.js";

const PORT = process.env.PORT || 3000;

// 1. 서버 객체 생성
const app = express();

// 3. 미들웨어 등록
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
); // CORS를 허용.

// 4-1. routes 등록
app.use(router);

// 4-2. 에러 미들웨어 등록
app.use(handleError);

// 5. 서버 연결
app.listen(PORT, () => {
  console.log(`Server Started ${PORT}`);
});
