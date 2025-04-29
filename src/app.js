const express = require("express");
const router = require("./modules/index.module");

const app = express();
const PORT = 5050;
const cors = require("cors");

app.use(cors()); // CORS 허용 (프론트와 포트 다를 경우 필수)

app.use(express.json()); // json 파싱을 해줘야함.
app.use(router);

app.listen(PORT, () => {
  console.log(`Server started to listen at port number ${PORT}...`);
});
