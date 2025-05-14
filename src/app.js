import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter.js";
import articleRouter from "./routes/articleRouter.js";
import productRouter from "./routes/productRouter.js";
import commentRouter from "./routes/commentRouter.js";
import imageRouter from "./routes/imageRouter.js";
import errorHandler from "./middlewares/errorHandler.js";
import { swaggerUi, specs } from "./swagger.js";
import "dotenv/config";
import passport from "passport";
import "./config/passport.js";

const app = express();
const PORT = process.env.PORT || 5050;

app.set("trust proxy", 1);
app.use(passport.initialize());

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/image", express.static("uploads"));

app.use("/", userRouter);
app.use("/articles", articleRouter);
app.use("/products", productRouter);
app.use("/comments", commentRouter);
app.use("/images", imageRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
