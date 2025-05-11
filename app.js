import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import indexRouter from "./src/routes/index.route.js";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

const PORT = 7777;
const ALLOWEPORT = 3000;
const app = express();

// ✅ 정적 파일 서빙 (최상단에 위치하는 것이 안전)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(cookieParser()); // ✅ 필수!

// 허용할 도메인들
const allowedOrigins = [
  `http://localhost:${ALLOWEPORT}`, // 로컬 환경
  "https://6-sprint-mission-fe-git-react-parkminkus-projects.vercel.app",
  "https://6-sprint-mission-fe-git-next-parkminkus-projects.vercel.app",
  "https://6-sprint-mission-fe.vercel.app",
  // 배포된 환경
];

// CORS 설정
app.use(
  cors({
    origin: function (origin, callback) {
      // 요청하는 origin이 허용된 origin 목록에 있는지 확인
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // PATCH 추가
    allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더 설정
  })
);

app.use(express.json());

app.use(indexRouter);

app.use((err, req, res, next) => {
  console.log(err);

  switch (err.name) {
    case "ValidationError":
      res
        .status(400)
        .send({ message: "ValidationError : body의 내용이 빠졌습니다!" });
      break;
    case "CastError":
      res.status(400).send({ message: "Invalid product ID" });
      break;
    case "UnauthorizedError":
      return res
        .status(401)
        .json({ message: "인증에 실패했습니다. 다시 로그인해주세요." });
    default:
      res.status(500).send({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
