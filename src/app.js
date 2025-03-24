const express = require("express");
const router = require("./modules/index.module");

const app = express();
const PORT = 5050;

app.use(express.json());
//함수를 반환하는 라우터 함수
app.use(router);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}...`);
});
