import swaggerJsdoc from "swagger-jsdoc";
import { Options } from "swagger-jsdoc";

const options: Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "6-sprint-mission-be API",
      version: "1.0.0",
      description: "6-sprint-mission-be 애플리케이션을 위한 API 문서입니다.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "개발 서버",
      },
    ],
  },
  apis: ["./src/routes/**/*.ts", "./src/controllers/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
