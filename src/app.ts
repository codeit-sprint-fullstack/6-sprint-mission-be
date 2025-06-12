import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter";
import articleRouter from "./routes/articleRouter";
import productRouter from "./routes/productRouter";
import commentRouter from "./routes/commentRouter";
import imageRouter from "./routes/imageRouter";
import errorHandler from "./middlewares/errorHandler";
// import { swaggerUi, specs } from "./swagger";
import "dotenv/config";
import passport from "passport";
import "./config/passport";

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
// app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
