//import * as productRepository from '../repositories/productRepository.js';
import jwt from 'jsonwebtoken';
import * as authRepository from '../repositories/authRepository.js';
import { HttpError } from '../middlewares/HttpError.js';
import bcrypt from 'bcrypt';

export const signUp = async (data) => {
    const entity = await authRepository.save(data);
    if (data.password !== data.passwordConfirmation) {
        throw HttpError(401, '비밀번호가 일치하지 않습니다.');
    }
    const user = await authRepository.findByEmail(data.email);
    if (user) {
        throw new HttpError(409, '이미 가입된 이메일 입니다.');
    }

    const accessToken = jwt.sign({ userId: entity.id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
    });

    const refreshToken = jwt.sign({ userId: entity.id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });

    await authRepository.update(entity.id, { token: refreshToken });

    return {
        accessToken,
        refreshToken,
        user: {
            id: entity.id,
            email: entity.email,
            image: entity.image,
            nickname: entity.nickname,
            updatedAt: entity.updatedAt,
            createdAt: entity.createdAt,
        },
    };
};

export const signIn = async (data) => {
    const user = await authRepository.findByEmail(data.email);
    if (!user) {
        throw new HttpError(404, '해당 유저를 찾을 수 없습니다');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
        throw new HttpError(401, '비밀번호가 일치하지 않습니다.');
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
    });

    const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });

    await authRepository.update(user.id, { token: refreshToken });

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            image: user.image,
            nickname: user.nickname,
            updatedAt: user.updatedAt,
            createdAt: user.createdAt,
        },
    };
};

export const refreshAccessToken = async (refreshToken) => {
    // 리프레시 토큰으로 유저 찾기
    const user = await authRepository.findByToken(refreshToken);
    if (!user) {
        throw new HttpError(401, '유효하지 않은 리프레시 토큰입니다');
    }

    // 토큰 유효성 검증 (jwt.verify 사용)
    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        throw new HttpError(401, '리프레시 토큰이 만료되었거나 유효하지 않습니다');
    }

    // 새 액세스 토큰 발급
    const newAccessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
    });

    return { accessToken: newAccessToken };
};
