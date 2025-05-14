import { expressjwt } from "express-jwt";
import jwt from 'jsonwebtoken';
import userService from '../services/authService.js';

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

const verifyRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: '리프레시 토큰이 없습니다.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
    const user = await userService.findUserByRefreshToken(refreshToken);
    if (!user || user.id !== decoded.userId) {
      return res.status(401).json({ message: '유효하지 않은 리프레시 토큰입니다.' });
    }
    req.auth = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: '유효하지 않은 리프레시 토큰입니다.' });
  }
};

function validateEmailAndPassword(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new Error("email, password 가 모두 필요합니다.");
    error.code = 422;
    return next(error);
  }
  next();
}

function validateSignupData(req, res, next) {
  const { email, password, nickname } = req.body;
  if (!email || !password || !nickname) {
    const error = new Error("email, password, nickname 가 모두 필요합니다.");
    error.code = 422;
    return next(error);
  }
  next();
}

export default {
  verifyAccessToken,
  verifyRefreshToken,
  validateEmailAndPassword,
  validateSignupData,
};