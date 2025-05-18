const express = require("express");
const router = require("./controllers/index.controller.js");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler.js");
const path = require("path");

const app = express();
const PORT = 3002;

// cors 설정
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// 이미지 저장한 거 확인 가능
app.use("/files", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
