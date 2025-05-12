// src/config/swagger.js
import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "My API",
    version: "1.0.0",
    description: "API 문서 자동 생성 예시입니다.",
  },
  servers: [
    {
      url: "http://localhost:7777",
      description: "pandaMarket-server",
    },
  ],
  components: {
    securitySchemes: {
      refreshToken: {
        type: "apiKey",
        in: "cookie",
        name: "refreshToken", // 또는 Authorization 헤더 등 실제 사용 방식에 맞춰
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"], // JSDoc 주석이 작성된 파일 경로
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
