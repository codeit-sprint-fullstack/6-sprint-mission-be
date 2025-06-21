const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const option = {
    definition: {
        openai: "3.0.0",
        info: {
            title: "나의 API",
            versiton: "1.0.0",
        },
    },
    apis: ["./routes/*.js"],
};

const specs = swaggerJSDoc(options);

module.exports = { swaggerUi, specs };

router.get("/user", getUsers);


