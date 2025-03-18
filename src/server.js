const express = require("express");
const mongoose = require("mongoose");
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

mongoose.connect(DATABASE_URL).then(() => console.log("connected"));

server.listen(PORT, () => {
  console.log(`server started ${PORT}`);
});
