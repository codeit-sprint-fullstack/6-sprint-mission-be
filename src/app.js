const express = require("express");
const router = require("./modules/index.module");

const app = express();
const PORT = 5050;

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`${PORT}에서 서버 실행중!`);
});

// prisma를 가지고 postgresql을 사용할 것이다.
