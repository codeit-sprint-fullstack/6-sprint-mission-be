import express from "express";
import cookieParser from "cookie-parser";
import userController from "./controllers/userController.js";
import cors from "cors";
import productController from "./controllers/productController.js";
import path from "path";
import productCommentController from "./controllers/productCommentController.js";
import favoriteController from "./controllers/favoriteController.js";

const app = express();

// 프론트에서 요청이 동작하기 위해 cors 적용
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

// app 설정
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 컨트롤러 연결
app.use("/", userController);
app.use("/products", productController);
app.use("/", productCommentController);
app.use("/", favoriteController);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
