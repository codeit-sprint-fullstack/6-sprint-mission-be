import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routers/user.router";
import articleRouter from "./routers/article.router";
import productRouter from "./routers/product.router";
import commentRouter from "./routers/comment.router";
import imageRouter from "./routers/image.router";
import errorHandler from "./middlewares/errorHandler";
import { swaggerUi, specs } from "./swagger";
import "dotenv/config";
import passport from "passport";
import "./configs/passport.config";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);
app.use(passport.initialize());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
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

export default app;
