const express = require("express");
const router = require("./routes/index.route");
const cors = require("cors");

const app = express();
const PORT = 3002;

// cors 설정
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
