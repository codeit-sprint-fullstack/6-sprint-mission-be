import authService from "../services/authService.js";
import { generateAccessToken, generateRefreshToken } from '../utils/jwtUtils.js';

const authController = {
  async signup(req, res, next) {
    try {
      const { email, nickname, password, passwordConfirmation } = req.body;
      const newUserInfo = await authService.signup(email, nickname, password, passwordConfirmation);
      const accessToken = generateAccessToken(newUserInfo.id);
      const refreshToken = generateRefreshToken(newUserInfo.id);
      await authService.saveRefreshToken(newUserInfo.id, refreshToken);

      res.status(201).json({
        accessToken,
        refreshToken,
        user: newUserInfo,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userInfo = await authService.login(email, password);
      const accessToken = generateAccessToken(userInfo.id);
      const refreshToken = generateRefreshToken(userInfo.id);
      await authService.saveRefreshToken(userInfo.id, refreshToken);

      res.cookie('refreshToken', refreshToken, { httpOnly: true,sameSite: "none",secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7일
      res.status(200).json({ accessToken, user: userInfo });
    } catch (error) {
      next(error);
    }
  },

  async getUserInfo(req, res, next) {
    try {
      const userId = req.auth.id;
      const user = await authService.getUserById(userId);
      res.json({ id: user.id, email: user.email, nickname: user.nickname, profileImage: user.profileImage }); 
    } catch (error) {
      next(error);
    }
  },

  async refreshAccessToken(req, res, next) {
    const refreshToken = req.cookies.refreshToken;
    try {
      const user = await authService.findUserByRefreshToken(refreshToken);
      if (!user) {
        return res.status(401).json({ message: '유효하지 않은 리프레시 토큰입니다.' });
      }
      const newAccessToken = generateAccessToken(user.id);
      res.json({ token: newAccessToken });
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    const refreshToken = req.cookies.refreshToken;
    try {
      await authService.clearRefreshToken(refreshToken);
      res.clearCookie('refreshToken', { httpOnly: true, secure: true });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

export default authController;