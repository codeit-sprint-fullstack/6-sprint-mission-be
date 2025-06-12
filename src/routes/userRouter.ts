import express from "express";
import auth from "../middlewares/auth";
import {
  getUser,
  refreshToken,
  signIn,
  signUp,
  socialLogin,
} from "../controllers/userController";
import { signInValidator, signUpValidator } from "../middlewares/validator";
import passport from "passport";

const userRouter = express.Router();

userRouter.get("/users/me", auth.verifyAccessToken, getUser);
userRouter.post("/auth/signUp", signUpValidator, signUp);
userRouter.post("/auth/signIn", signInValidator, signIn);
userRouter.post("/auth/refresh-token", auth.verifyRefreshToken, refreshToken);
userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  socialLogin
);
userRouter.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
userRouter.get(
  "/auth/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/login",
    session: false,
  }),
  socialLogin
);
userRouter.get(
  "/auth/kakao",
  passport.authenticate("kakao", {
    scope: ["profile_nickname", "account_email"],
    session: false,
  })
);

export default userRouter;
