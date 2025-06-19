import express from "express";
import userController from "./controllers/userController";
import authController from "./controllers/authController";
import articleController from "./controllers/articleController";
import commentController from "./controllers/commentController";
import productController from "./controllers/productController";
import cors from "cors";
import dotenv from "dotenv";
import favoriteController from "./controllers/favoriteController";
import { swaggerSpec } from "./swagger";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "https://6-sprint-mission-fe-git-next-sprint10-sukyoung-ks-projects.vercel.app",
    ],
    credentials: true,
  })
);
app.use("/uploads", express.static("uploads"));

app.use("/users/me", userController); //사용자 정보 컨트롤러
app.use("/auth", authController); //회원가입, 로그인 컨트롤러
app.use("/products", productController); //상품+댓글 컨토롤러
app.use("/articles", articleController); //게시글+댓글 컨트롤러
app.use("/comments", commentController); //댓글 컨트롤러
app.use("/favorites", favoriteController); //좋아요 컨트롤러

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started at ${PORT}...`);
  console.log("swagger 문서: http://localhost:3000/api-docs");
});
