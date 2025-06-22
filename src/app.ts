import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import userController from "./controllers/userController";
import articleController from "./controllers/articleController";
import productController from "./controllers/productController";
import commentController from "./controllers/commentController";
import errorHandler from "./middlewares/errorHandler";
import upload from "./middlewares/multer";

const app = express();

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:3000", // 프론트엔드 주소
    credentials: true, // 쿠키 전송 허용
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", userController);
app.use("/article", articleController);
app.use("/product", productController);
app.use("/comment", commentController);

app.post("/photos", upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "파일이 업로드되지 않았습니다." });
    return;
  }

  const filename = req.file.filename;
  const path = `/profile/${filename}`;
  res.json({ path });
});

app.use("/photos", express.static("uploads"));

app.use(errorHandler);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Server started to listen at port number ${port}...`);
});
