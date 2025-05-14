import userService from "../services/userService.js";

/**
 * 회원가입
 */
export async function signUp(req, res, next) {
  const { email, nickname, password } = req.body;
  try {
    const user = await userService.createUser({ email, nickname, password });
    res.status(201).json({ user: user });
  } catch (error) {
    next(error);
  }
}

/**
 * 로그인
 */
export async function signIn(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await userService.getUser(email, password);
    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, "refresh");
    await userService.updateUser(user.id, { refreshToken });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.json({ user: user, accessToken });
  } catch (error) {
    next(error);
  }
}

/**
 * 토큰 갱신
 */
export async function refreshToken(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { userId } = req.auth;
    const { newAccessToken, newRefreshToken } = await userService.refreshToken(
      userId,
      refreshToken
    );
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/auth/refresh-token",
    });
    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
}

/**
 * 유저 정보 조회
 */
export async function getUser(req, res, next) {
  try {
    const { userId } = req.auth;
    const user = await userService.getUserById(userId);
    console.log(user);
    return res.json(user);
  } catch (error) {
    next(error);
  }
}

/**
 * 소셜 로그인
 */
export function socialLogin(req, res, next) {
  try {
    const accessToken = userService.createToken(req.user);
    const refreshToken = userService.createToken(req.user, "refresh");
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/auth/refresh-token",
    });
    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
}
