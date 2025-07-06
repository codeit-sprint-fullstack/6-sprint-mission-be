import express from "express";
import {
  getUserController,
  refreshTokenController,
  signInController,
  signUpController,
  socialLoginController,
} from "../controllers/user.controller";
import {
  signInValidator,
  signUpValidator,
  validator,
} from "../middlewares/validator";
import passport from "passport";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../middlewares/verifyToken";

const userRouter = express.Router();

userRouter.get("/users/me", verifyAccessToken, getUserController);
userRouter.post("/auth/signUp", signUpValidator, validator, signUpController);
userRouter.post("/auth/signIn", signInValidator, validator, signInController);
userRouter.post(
  "/auth/refresh-token",
  verifyRefreshToken,
  refreshTokenController
);
userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  socialLoginController
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
  socialLoginController
);
userRouter.get(
  "/auth/kakao",
  passport.authenticate("kakao", {
    scope: ["profile_nickname", "account_email"],
    session: false,
  })
);

export default userRouter;
