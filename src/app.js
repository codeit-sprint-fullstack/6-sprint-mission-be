const cookieParser = require("cookie-parser");
const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/auth"); //회원가입, 로그인 컨트롤러
app.use("/users/me"); //사용자 정보 컨트롤러
app.use("/products"); //item 컨토롤러
app.use("/"); //댓글 컨트롤러
app.use("/articles"); //게시글 컨트롤러

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}...`);
});
