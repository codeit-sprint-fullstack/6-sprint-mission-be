// src/app.ts
import express, { Application, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger"; // './swagger.js'로 확장자 추가 필요 (CommonJS 환경이면 불필요)
import userRouter from "./routes/user.route"; // './routes/user.route.js'
import productRouter from "./routes/product.route"; // './routes/product.route.js'
import commentRouter from "./routes/comment.route"; // './routes/comment.route.js'
import authRouter from "./routes/auth.route"; // './routes/auth.route.js'
import articleRouter from "./routes/article.route"; // './routes/article.route.js'
import imageRouter from "./routes/image.route"; // './routes/image.route.js'
import { errorConverter, errorHandler } from "./middlewares/error.middleware"; // './middlewares/error.middleware.js'
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import multer from "multer";
import path from "path";

const app: Application = express();
const UPLOADS_DIR = "uploads/";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/" + UPLOADS_DIR, express.static(UPLOADS_DIR));

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/comments", commentRouter);
app.use("/articles", articleRouter);
app.use("/images", imageRouter);

app.post("/upload", upload.single("image"), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).send({ message: "No image file uploaded." });
  }
  if (req.file) {
    const fileUrl = `/${UPLOADS_DIR}${req.file.filename}`;
    res.send({ url: fileUrl });
  } else {
    res.status(400).send({ message: "업로드된 파일이 없습니다." });
  }
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorConverter);
app.use(errorHandler);

export default app; // 앱 객체를 내보냅니다.