import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

import userController from "./controllers/userController.js";
import articleController from "./controllers/articleController.js";
import productController from "./controllers/productController.js";
import commentController from "./controllers/commentController.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(cors()); // CORS 허용 (프론트와 포트 다를 경우 필수)
app.use(express.json());
app.use(cookieParser());

app.use("/", userController);
app.use("/article", articleController);
app.use("/product", productController);
app.use("/comment", commentController);

const upload = multer({ dest: "uploads/" });

app.post('/photos', upload.single('image'), (req, res) => {
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
