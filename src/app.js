import express from "express";
import userController from "./controllers/userController.js";
import authController from "./controllers/authController.js";
import articleController from "./controllers/articleController.js";
import commentController from "./controllers/commentController.js";
import productController from "./controllers/productController.js";
import errorHandler from "./middlewares/erroHandler.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("uploads"));

app.use("/users/me", userController); //사용자 정보 컨트롤러
app.use("/auth", authController); //회원가입, 로그인 컨트롤러
app.use("/products", productController); //상품+댓글 컨토롤러
app.use("/articles", articleController); //게시글+댓글 컨트롤러
app.use("/comments", commentController); //댓글 컨트롤러

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started at ${PORT}...`);
});
