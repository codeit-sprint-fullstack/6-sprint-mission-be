import userService from "../services/userService.js";

// 회원가입 핸들러
export async function signUp(req, res, next) {
  try {
    const { email, nickname, password, image } = req.body;
    if (!email || !nickname || !password) {
      return res.status(400).json({ message: "모든 필드를 입력해주세요." });
    }

    const user = await userService.register({
      email,
      nickname,
      password,
      image,
    });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

// 로그인 핸들러
export async function signIn(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "이메일과 비밀번호가 필요합니다." });
    }

    const user = await userService.login({ email, password });
    const accessToken = userService.generateToken(user);
    const refreshToken = userService.generateToken(user, "refresh");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.json({ ...user, accessToken });
  } catch (err) {
    next(err);
  }
}
