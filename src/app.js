import express from "express";
import cookieParser from "cookie-parser";
import userController from "./controllers/userController.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

// 컨트롤러 연결
app.use("", userController);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
