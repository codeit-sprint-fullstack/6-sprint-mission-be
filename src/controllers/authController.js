import express from "express";
import varify from "../middlewares/varify.js";
import authService from "../services/authService.js";
import generateAccessToken from "../middlewares/utils.jwt.js";

const authController = express.Router();

//회원가입
authController.post(
  "/signUp",
  varify.signUpRequestStructure,
  varify.checkExistedEmail,
  async (req, res, next) => {
    try {
      const createUser = await authService.create(req.body);

      const accessToken = generateAccessToken(createUser);
      return res.json({
        accessToken,
        user: {
          id: createUser.id,
          email: createUser.email,
          nickname: createUser.nickname,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

//로그인
authController.post("/signIn", async (req, res, next) => {
  try {
    const user = await authService.getByEmail(req.body);

    if (!user) {
      const error = new Error("Not Found, 존재하지 않는 사용자입니다.");
      error.code = 404;
      throw error;
    }

    const accessToken = authService.createToken(user);

    return res.json({ ...user, accessToken });
  } catch (error) {
    next(error);
  }
});

export default authController;
