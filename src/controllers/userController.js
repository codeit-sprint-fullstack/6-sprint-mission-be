import express from "express";
import userService from "../services/userService.js";

const userController = express.Router();

userController.post("/auth/signUp", async (req, res, next) => {
  try {
    const { email, nickName, password } = req.body;
    if (!email || !nickName || !password) {
      const error = new Error("email, name, password 가 모두 필요합니다.");
      error.code = 422;
      throw error;
    }
    const user = await userService.createUser({
      email,
      nickName,
      encryptedPassword: password,
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

userController.post("/auth/signIn", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new Error("email, password 가 모두 필요합니다.");
      error.code = 422;
      throw error;
    }
    const user = await userService.getUser({ email, inputPassword: password });
    const accessToken = userService.createToken(user);
    res.json({ ...user, accessToken });
  } catch (error) {
    next(error);
  }
});

export default userController;
