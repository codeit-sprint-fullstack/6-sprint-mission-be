import express from "express";
import auth from "../middlewares/auth.js";
import { refreshToken, signIn, signUp } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/auth/signUp", signUp);
userRouter.post("/auth/signIn", signIn);
userRouter.post("/auth/refresh-token", auth.verifyRefreshToken, refreshToken);

export default userRouter;
