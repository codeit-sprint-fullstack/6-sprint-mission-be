import express from "express";

import {
  getUser,
  refreshToken,
  signIn,
  signUp,
  socialLogin,
} from "../controllers/userController";
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

userRouter.get("/users/me", verifyAccessToken, getUser);
userRouter.post("/auth/signUp", signUpValidator, validator, signUp);
userRouter.post("/auth/signIn", signInValidator, validator, signIn);
userRouter.post("/auth/refresh-token", verifyRefreshToken, refreshToken);
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
