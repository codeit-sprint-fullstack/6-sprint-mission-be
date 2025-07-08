import "./config/env";

// 나머지 import는 그 다음에
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import indexRouter from "./routes/index.route";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import commonError from "./middlewares/errors/commonError";

const PORT = parseInt(process.env.PORT || "7777", 10);
const ALLOWEPORT = 3000;
const app = express();

app.use(cookieParser()); // ✅ 필수!

// 허용할 도메인들
const allowedOrigins = [
  `http://localhost:${ALLOWEPORT}`,
  `http://localhost:${PORT}`,
  "http://3.38.228.28", // ✅ IP 주소
  "https://pandamarket.site", // ✅ 메인 도메인
  "https://www.pandamarket.site", // ✅ www 서브도메인
  "https://api.pandamarket.site", // ✅ 스웨거 도메인
];

// CORS 설정
app.use(
  cors({
    origin: function (origin, callback) {
      // 요청하는 origin이 허용된 origin 목록에 있는지 확인
      if (allowedOrigins.indexOf(origin || "") !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ 필수! 쿠키/인증 헤더 허용
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // PATCH 추가
    allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더 설정
  })
);

app.use(express.json());

// 스웨거 링크
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(indexRouter);

app.use(commonError);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
