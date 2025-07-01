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
      // nginx 붙이면 80으로 수정해 줘야함 (즉 뒤에 포트 빼버려도됨 http://3.38.228.28)
      url: isProd ? "https://api.pandamarket.site" : "http://localhost:7777",
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
      accessToken: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: "액세스 토큰을 입력하세요 (Bearer 없이)",
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
