import dotenv from "dotenv";
import path from "path";

// NODE_ENV 기반으로 환경별 .env 파일 로드
dotenv.config({
  path: path.resolve(
    process.cwd(),
    `.env.${process.env.NODE_ENV || "development"}`
  ),
});

console.log(
  `[env] ${process.env.NODE_ENV || "development"} 환경에서 ${`.env.${
    process.env.NODE_ENV || "development"
  }`} 로드 완료`
);
