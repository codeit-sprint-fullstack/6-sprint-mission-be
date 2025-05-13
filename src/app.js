import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import dotenv from "dotenv";

import userController from "./controllers/userController.js";
import articleController from "./controllers/articleController.js";
import productController from "./controllers/productController.js";
import commentController from "./controllers/commentController.js";
import errorHandler from "./middlewares/errorHandler.js";

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

const upload = multer({ dest: "uploads/" });

app.post("/photos", upload.single("image"), (req, res) => {
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
