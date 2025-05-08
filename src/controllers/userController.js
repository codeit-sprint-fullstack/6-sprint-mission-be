import express from "express";
import userService from "../service/userService.js";
import multer from "multer";
import auth from "../middlewares/auth.js";
import { REFRESH_TOKEN_TTL_MS } from "../constants/token.js";

const userController = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // 저장 폴더
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });

// 로그인
userController.post("/signIn", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userService.getUser(email, password);

    // accessToken은 로컬스토리지 관리를위해 body로 넘기기
    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, "refresh");
    await userService.updateUser(user.id, { refreshToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      path: "/", // 접근 가능 경로 설정
      secure: false, // 로컬에선 false로 이유는 https는 로컬에서 적용이 어려움
      // maxAge는 클라이언트에서 시간을 조회하는 용도임 서버는 expiresIn로 판단함
      // 또한 maxAge는 ms단위임
      // expiresIn는 s단위와 문자열 단위 가능, 근데 문자열이 훨씬 가독성 좋음
      maxAge: REFRESH_TOKEN_TTL_MS,
    });

    res.status(201).json({ user, accessToken });
  } catch (error) {
    next(error);
  }
});

// 회원가입
userController.post("/signUp", async (req, res, next) => {
  try {
    const { nickname, email, password } = req.body;

    const signUpResult = await userService.createUser({
      nickname,
      email,
      password,
    });

    const refreshToken = userService.createToken(signUpResult, "refresh");

    const signUpRefreshUpdate = await userService.updateUser(signUpResult.id, {
      ...signUpResult,
      refreshToken,
    });

    res.status(201).json({ signUpRefreshUpdate });
  } catch (error) {
    next(error);
  }
});

// 토큰 재발급
// accessToken이 만료되었을 때만 호출해서 JWT 슬라이딩 전략 이용
// 만약 refreshToken의 만료기간이 4일 이하라면 refreshToken도 재발급 후 저장 및 반환
// cookie의 refreshToken 만료는 14일, refreshToken 자체의 만료는 10일임
userController.post(
  "/token/refresh",
  auth.verifyRefreshToken,
  async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      const { userId } = req.auth;

      const { accessToken, newRefreshToken } = await userService.refreshToken(
        userId,
        refreshToken
      );

      // JWT 슬라이딩 세션이 적용 되었다면 실행
      if (newRefreshToken) {
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          sameSite: "none",
          secure: false, // 로컬에서는 false
          path: "/", // 모든 요청에서 일관되게 접근 가능
          maxAge: 1000 * 60 * 60 * 24 * 14, // 14일
        });
      }

      return res.json({ accessToken });
    } catch (error) {
      return next(error);
    }
  }
);

// 유저 정보 업데이트
// 이미지를 서버에 저장시켜야 하나? 그러면 디비에는 서버의 주소만 담는다?
userController.patch(
  "/users/:id",
  upload.single("profile"),
  async (req, res, next) => {
    try {
      const userId = req.params.id;
      const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

      const data = {
        ...req.body,
        image: imagePath, // DB에는 경로만 저장
      };

      const updated = await userService.updateUser(userId, data);
      return res.json(updated);
    } catch (error) {
      next(error);
    }
  }
);

// 유저 정보 삭제

export default userController;
