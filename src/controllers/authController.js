import authService from "../service/authService.js";
import userService from "../service/userService.js";
import { REFRESH_TOKEN_TTL_MS } from "../constants/token.js";

// 로그인
const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.signIn(email, password);
    const accessToken = authService.createToken(user);
    const refreshToken = authService.createToken(user, "refresh");

    await userService.updateUser(user.id, { refreshToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      path: "/",
      secure: false,
      maxAge: REFRESH_TOKEN_TTL_MS,
    });

    res.status(201).json({ user, accessToken });
  } catch (error) {
    next(error);
  }
};

// 회원가입
// TODO: 회원가입시에 바로 로그인을 진행시킬까 말까
const signUp = async (req, res, next) => {
  try {
    const { nickname, email, password } = req.body;

    const signUpResult = await userService.createUser({
      nickname,
      email,
      password,
    });
    const refreshToken = authService.createToken(signUpResult, "refresh");

    const signUpUserData = await userService.updateUser(signUpResult.id, {
      ...signUpResult,
      refreshToken,
    });

    res.status(201).json({ signUpUserData });
  } catch (error) {
    next(error);
  }
};

// 토큰 재발급
const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { userId } = req.auth;

    const { accessToken, newRefreshToken } = await authService.refreshUserToken(
      userId,
      refreshToken
    );

    if (newRefreshToken) {
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: false,
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 14,
      });
    }

    return res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export default {
  signIn,
  signUp,
  refreshToken,
};
