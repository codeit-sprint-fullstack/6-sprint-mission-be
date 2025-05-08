import express from "express";
import varify from "../middlewares/varify.js";
import userService from "../services/userService.js";

const userController = express.Router();

//회원가입
userController.post(
  "/signUp",
  varify.signUpRequestStructure,
  async (req, res, next) => {
    const createUser = await userService.create(req.body);
    return res.json(createUser);
  }
);

//로그인
userController.post("/signIn", async (req, res, next) => {
  const user = await userService.getByEmail(req.body);

  if (!user) {
    const error = new Error("Not Found, 존재하지 않는 사용자입니다.");
    error.code = 404;
    throw error;
  }

  const accessToken = userService.createToken(user);

  res.json({ ...user, accessToken });
});

export default userController;
