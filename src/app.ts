import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import userController from "./controllers/userController";
import errorHandler from "./middlewares/errorHandler";
import itemController from "./controllers/itemController";
import commentController from "./controllers/commentController";

const app = express();

app.use(cors());

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/products", itemController);
app.use("/users", userController);
app.use("/comments", commentController);

app.use(errorHandler);

app.listen(process.env.PORT);
