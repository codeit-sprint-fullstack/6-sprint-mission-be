import express from "express";
import cors from "cors";
import userController from "./controllers/userController.js";
import errorHandler from "./middlewares/errorHandler.js";
import productController from "./controllers/productController.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/products", productController);
app.use("/users", userController);

app.use(errorHandler);

app.listen(3001);
