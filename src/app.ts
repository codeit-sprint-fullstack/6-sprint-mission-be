import express from "express";
import userController from "./controllers/userController";
import authController from "./controllers/authController";
import articleController from "./controllers/articleController";
import commentController from "./controllers/commentController";
import productController from "./controllers/productController";
import cors from "cors";
import dotenv from "dotenv";
import favoriteController from "./controllers/favoriteController";
import { swaggerSpec } from "./swagger";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middlewares/errorHandler";
import { S3Client } from "@aws-sdk/client-s3"; //s3에 접근하기 위해 사용됨
import multer from "multer";
import multerS3 from "multer-s3";

dotenv.config();

const app = express();

// app.use("/uploads", express.static("uploads")); 이 코드는 express가 직접 이미지를 제공하겠다는 뜻
// 그래서 이제 s3가 이미지 응답을 대신해줄거라서 s3 클라이언트를 생성하는 코드를 만들어야 함
const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// const upload = multer({dest:"uploads/"}); destination에 업로드를 해주는 코드
//dest 대신에 storage라는 속성을 이용해서 업로드의 위치처리를 multer-s3가 해줌.
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME!,
    key: (req, file, cb) => {
      cb(null, `public/${Date.now()}_${file.originalname}`); //업로드 되는 위치
    },
  }),
});

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "https://6-sprint-mission-fe-git-next-sprint10-sukyoung-ks-projects.vercel.app",
    ],
    credentials: true,
  })
);

app.use("/users/me", userController); //사용자 정보 컨트롤러
app.use("/auth", authController); //회원가입, 로그인 컨트롤러
app.use("/products", productController); //상품+댓글 컨토롤러
app.use("/articles", articleController); //게시글+댓글 컨트롤러
app.use("/comments", commentController); //댓글 컨트롤러
app.use("/favorites", favoriteController); //좋아요 컨트롤러

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started at ${PORT}...`);
  console.log("swagger 문서: http://localhost:3000/api-docs");
});
