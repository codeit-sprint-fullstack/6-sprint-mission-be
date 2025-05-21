import { createRequire } from "module";
const require = createRequire(import.meta.url);
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Panda Market API",
      version: "1.0.0",
      description: "swagger docs for sprint mission 10",
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
    host: "localhost:5050",
    basePath: "/",
  },
  apis: [path.resolve(__dirname, "swagger/*.yaml")],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
