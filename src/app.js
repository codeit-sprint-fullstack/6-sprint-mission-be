const express = require("express");
const router = require("./modules/index.module");
const cors = require("cors");

const app = express();
const PORT = 5050;

const corsOptions = {
  origin: ["http://localhost:3000"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
