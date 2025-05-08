// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "6-sprint-mission-be",
      version: "1.0.0",
      description: "API documentation for 6-sprint-mission-be Application",
    },
    servers: [
      {
        url: "http://localhost:5050", // 실제 서버 URL로 변경: 5050
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"], // API 라우트 및 컨트롤러 파일 경로
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
