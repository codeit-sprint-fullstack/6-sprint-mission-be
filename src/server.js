const express = require("express");
const router = require("./modules/index.module");
require("dotenv").config();
const { PORT, DATABASE_URL } = process.env;
const cors = require("cors");
const errorHandler = require("./middleware/errorHandle.middleware");

const server = express();
server.use(cors());

server.use(express.json());
server.use(router);
server.use(errorHandler);

server.listen(PORT, () => {
  console.log(`server started ${PORT}`);
});
