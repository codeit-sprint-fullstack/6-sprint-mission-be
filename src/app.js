const express = require("express");
const cors = require("cors");
const router = require("./modules/index.module");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}...`);
});
