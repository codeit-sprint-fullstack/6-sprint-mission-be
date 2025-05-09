import userService from "../services/userService.js";

export async function signUp(req, res, next) {
  const { email, nickname, password } = req.body;
  try {
    if (!email || !nickname || !password) {
      const error = new Error("email, nickname, password 가 모두 필요합니다.");
      error.code = 422;
      throw error;
    }
    const user = await userService.createUser({ email, nickname, password });
    res.status(201).json({ user: user });
  } catch (error) {
    next(error);
  }
}

export async function signIn(req, res, next) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      const error = new Error("email, password 가 모두 필요합니다.");
      error.code = 422;
      throw error;
    }
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
    return next(error);
  }
}
