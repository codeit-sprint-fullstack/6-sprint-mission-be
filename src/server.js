const express = require("express");
const mongoose = require("mongoose");
const router = require("./modules/index.module");
require("dotenv").config();
const { PORT, DATABASE_URL } = process.env;
const cors = require("cors");

const server = express();
server.use(express.json());
server.use(router);
// server.use(cors());
mongoose.connect(DATABASE_URL).then(() => console.log("connected"));

server.listen(PORT, () => {
  console.log(`server started ${PORT}`);
});
