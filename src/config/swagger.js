// src/config/swagger.js
import swaggerJSDoc from "swagger-jsdoc";

const isProd = process.env.NODE_ENV === "production";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "My API",
    version: "1.0.0",
    description: "API 문서 자동 생성 예시입니다.",
  },
  servers: [
    {
      url: isProd
        ? "https://six-sprint-mission-be.onrender.com"
        : "http://localhost:7777",
      description: isProd ? "배포 서버" : "로컬 개발 서버",
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
