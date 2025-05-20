// src/config/swagger.js
import swaggerJSDoc from "swagger-jsdoc";

const isProd = process.env.NODE_ENV === "production";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "panda-maket-api",
    version: "1.0.0",
    description: "pandaMaket API 명세서 입니다.",
  },
  servers: [
    {
      url: isProd
        ? "https://six-sprint-mission-be.onrender.com"
        : "http://localhost:7777",
      description: isProd ? "배포 서버" : "로컬 개발 서버",
    },
  ],
  // 스웨거 순서 설정 설정 안하면 기본값으로 알파벳순으로 적용됨
  tags: [
    {
      name: "Auth",
      description: "인증 관련 API",
    },
    {
      name: "User",
      description: "사용자 관련 API",
    },
    {
      name: "Product",
      description: "상품 관련 API",
    },
    {
      name: "Article",
      description: "게시글 관련 API",
    },
    {
      name: "Comment",
      description: "댓글 관련 API",
    },
  ],
  components: {
    securitySchemes: {
      refreshToken: {
        type: "apiKey",
        in: "cookie",
        name: "refreshToken",
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
