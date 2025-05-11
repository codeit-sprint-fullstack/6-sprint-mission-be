import express from "express";
import multer from "multer";
import userController from "../controllers/userController.js";
import auth from "../middlewares/users/auth.js";

const usersRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// 로그인
usersRouter.post("/signIn", userController.signIn);

// 회원가입
usersRouter.post("/signUp", userController.signUp);

// 토큰 재발급
usersRouter.post(
  "/token/refresh",
  auth.verifyRefreshToken,
  userController.refreshToken
);

// 유저 정보 수정
usersRouter.patch(
  "/users/:id",
  upload.single("profile"),
  userController.updateUser
);

export default usersRouter;
