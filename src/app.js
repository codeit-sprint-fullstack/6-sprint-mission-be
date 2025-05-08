import express from "express";
import productController from "./controllers/productController.js";
import userController from "./controllers/userController.js";
import articleController from "./controllers/articleController.js";

const app = express();

app.use(express.json());

app.use("/auth", userController); //회원가입, 로그인 컨트롤러
// app.use("/users/me"); //사용자 정보 컨트롤러
app.use("/products", productController); //item 컨토롤러
// app.use("/"); //댓글 컨트롤러
app.use("/articles", articleController); //게시글 컨트롤러

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started at ${PORT}...`);
});
