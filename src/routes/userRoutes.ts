import express from "express";
import auth from "../middlewares/auth";
import userController from "../controllers/userController";

const userRouter = express.Router();

// 회원가입
userRouter.post("/signUp", userController.signUp);

// 로그인
userRouter.post("/login", userController.login);

// 내 정보 불러오기
userRouter.get("/me", auth.verifyAccessToken, userController.getMe);

// 액세스 토큰 재발급
userRouter.post(
  "/refresh-token",
  auth.verifyRefreshToken,
  userController.refreshAccessToken
);

export default userRouter;
