import express from "express";
import auth from "../middlewares/auth.js";
import {
  getUser,
  refreshToken,
  signIn,
  signUp,
} from "../controllers/userController.js";
import {
  signInValidator,
  signUpValidator,
  validate,
} from "../middlewares/validator.js";

const userRouter = express.Router();

userRouter.get("/users/me", auth.verifyAccessToken, getUser);
userRouter.post("/auth/signUp", signUpValidator, validate, signUp);
userRouter.post("/auth/signIn", signInValidator, validate, signIn);
userRouter.post("/auth/refresh-token", auth.verifyRefreshToken, refreshToken);

export default userRouter;
