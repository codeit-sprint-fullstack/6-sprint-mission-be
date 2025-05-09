import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter.js";
import articlesRouter from "./routes/articlesRouter.js";
import errorHandler from "./middlewares/errorHandler.js";
import "dotenv/config";
import { swaggerUi, specs } from "./swagger.js";

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/", userRouter);
app.use("/articles", articlesRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
