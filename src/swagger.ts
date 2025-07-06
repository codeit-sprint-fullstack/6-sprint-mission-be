const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Panda Market API",
      version: "1.0.0",
      description: "swagger docs for panda market project",
    },
    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        jwt: [],
      },
    ],
    servers: [
      {
        url: "http://localhost:3000",
        description: "로컬 개발 서버",
      },
      {
        url: "https://api.panda-market.store",
        description: "배포 서버",
      },
    ],
  },
  apis: [path.resolve(__dirname, "swagger/*.yaml")],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
