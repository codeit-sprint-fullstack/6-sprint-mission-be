import authService from "../service/authService.js";
import userService from "../service/userService.js";
import { REFRESH_TOKEN_TTL_MS } from "../constants/token.js";
import jwt from "jsonwebtoken";

// 로그인
const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.signIn(email, password);
    const accessToken = authService.createToken(user);
    const refreshToken = authService.createToken(user, "refresh");

    await userService.updateUser(user.id, { refreshToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // 클라이언트 JS에서 접근 차단
      sameSite: "none", // ✅ cross-site 쿠키 허용
      secure: false, //
      path: "/",
      maxAge: REFRESH_TOKEN_TTL_MS,
    });

    res.status(201).json({ user, accessToken });
  } catch (error) {
    next(error);
  }
};

// 로그아웃
const logOut = async (req, res, next) => {
  try {
    let userId = req.auth?.userId;

    if (!userId) {
      const token = req.cookies?.refreshToken;
      if (!token) {
        return res.status(401).json({ message: "로그인 정보가 없습니다." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    }

    await authService.logout(userId);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none", // ✅ cross-site 쿠키 허용
      secure: false, //
      path: "/",
    });

    return res.status(200).json({ message: "로그아웃 되었습니다." });
  } catch (error) {
    next(error);
  }
};

// 회원가입
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
        sameSite: "none", // ✅ cross-site 쿠키 허용
        secure: false, //
        path: "/",
        maxAge: REFRESH_TOKEN_TTL_MS,
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
  logOut,
};
