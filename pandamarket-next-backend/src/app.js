import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import userController from "./controllers/userController.js";
import errorHandler from "./middlewares/errorHandler.js";
import productController from "./controllers/productController.js";
import commentController from "./controllers/commentController.js";

const app = express();

app.use(cors());

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/products", productController);
app.use("/users", userController);
app.use("/comments", commentController);

app.use(errorHandler);

app.listen(process.env.PORT);
