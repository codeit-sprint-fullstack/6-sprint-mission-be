import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import userController from "./controllers/userController.js";
import productController from "./controllers/productController.js";
import reviewController from "./controllers/reviewController.js";
import errorHandler from "./middlewares/errorHandler.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // 프론트 주소를 명시적으로 허용
    credentials: true, // 필요한 경우 (ex: 쿠키 사용)
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("", userController);
app.use("/products", productController);
app.use("/reviews", reviewController);

app.use(errorHandler);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
