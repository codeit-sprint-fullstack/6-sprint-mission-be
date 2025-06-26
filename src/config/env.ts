import dotenv from "dotenv";
import path from "path";

// NODE_ENV 기반으로 .env 파일 로딩
dotenv.config({
  path: path.resolve(
    process.cwd(),
    `.env.${process.env.NODE_ENV || "development"}`
  ),
});
