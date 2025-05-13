import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PandaMarket API Docs",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // 예시: User, Product, Comment 등 스키마 정의
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string", format: "email" },
            nickname: { type: "string" },
            image: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        // 추가 스키마 정의 가능
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/controllers/*.js"], // 주석 있는 파일 위치로 정확히 지정
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
