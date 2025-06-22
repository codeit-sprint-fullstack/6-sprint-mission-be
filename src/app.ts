import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler";

// 라우터 (routes로 구조 변경 가능)
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import articleRoutes from "./routes/article.routes";

const app = express();

// CORS 설정 (다른 미들웨어보다 먼저)
app.use(
  cors({
    origin: [
      "http://localhost:3000", // React 기본 포트
      "http://127.0.0.1:3000",
    ],
    credentials: true, // 쿠키를 포함한 요청 허용
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 미들웨어
app.use(express.json());
app.use(cookieParser());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("요청 수신됨:", req.method, req.url);
  next();
});

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "fallbackSecret",
    resave: false,
    saveUninitialized: false,
  })
);

// 라우팅
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/articles", articleRoutes);

app.use("/uploads", express.static("uploads"));

// 에러 핸들러
app.use(errorHandler);

// 서버 시작
const port = process.env.PORT ?? 4000;
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
