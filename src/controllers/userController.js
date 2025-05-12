import userService from "../service/userService.js";
import { REFRESH_TOKEN_TTL_MS } from "../constants/token.js";

// 로그인
const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userService.getUser(email, password);
    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, "refresh");

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
    const refreshToken = userService.createToken(signUpResult, "refresh");

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

    const { accessToken, newRefreshToken } = await userService.refreshToken(
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

// 유저 정보 수정
const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    const data = {
      ...req.body,
      image: imagePath,
    };

    const updated = await userService.updateUser(userId, data);
    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

export default {
  signIn,
  signUp,
  refreshToken,
  updateUser,
};
