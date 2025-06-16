import jwt from 'jsonwebtoken';
import { HttpError } from './HttpError.js';

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new HttpError(401, 'Authorization 헤더가 필요합니다');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new HttpError(401, '토큰 형식이 잘못되었습니다');
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log('🔥 decoded from JWT:', decoded);
        req.userId = decoded.userId;
        req.userEmail = decoded.userEmail;
        req.userNickname = decoded.userNickname;
        next();
    } catch (err) {
        throw new HttpError(401, '유효하지 않은 토큰입니다');
    }
}
