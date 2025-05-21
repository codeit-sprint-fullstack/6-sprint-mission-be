import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PandaMarket API 문서",
      version: "1.0.0",
      description: "Express 기반 REST API 명세서",
    },
    servers: [
      {
        url: "http://localhost:3000", // Express 서버 주소
      },
    ],

    components: {
      //security: bearerAuth 실행을 위함
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [], // 모든 API에 JWT 인증 요구
      },
    ],
  },
  apis: [
    "./src/controllers/*.js",
    "./src/services/*.js",
    "./src/repositories/*.js",
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
