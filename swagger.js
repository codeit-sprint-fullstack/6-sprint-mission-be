// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Panda Market API",
      version: "1.0.0",
      description: "Sprint Misson BE",
    },
    servers: [
      {
        url: "http://localhost:5050",
      },
    ],
  },
  apis: ["./routes/*.js", "./app.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
