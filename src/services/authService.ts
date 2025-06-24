//import * as productRepository from '../repositories/productRepository.js';
import jwt from 'jsonwebtoken';
import * as authRepository from '../repositories/authRepository';
import { HttpError } from '../middlewares/HttpError';
import bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from '../Dtos/UserDto';
export const signUp = async (data: CreateUserDto) => {
    if (data.password !== data.repeatpassowrd) {
        throw new HttpError(401, '비밀번호가 일치하지 않습니다.');
    }

    const existingUser = await authRepository.findByEmail(data.email);
    if (existingUser) {
        throw new HttpError(409, '이미 가입된 이메일 입니다.');
    }

    const { repeatpassowrd, ...rest } = data;
    const repodata = rest;

    const entity = await authRepository.save(rest); // ✅ 검증 통과 후 저장

    const accessToken = jwt.sign(
        {
            userId: entity.id,
            userEmail: entity.email,
            userNickname: entity.nickname,
        },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: '1h' },
    );

    const refreshToken = jwt.sign(
        {
            userId: entity.id,
            userEmail: entity.email,
            userNickname: entity.nickname,
        },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: '7d' },
    );

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

export const signIn = async (data: LoginUserDto) => {
    const user = await authRepository.findByEmail(data.email);
    if (!user) {
        throw new HttpError(404, '해당 유저를 찾을 수 없습니다');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
        throw new HttpError(401, '비밀번호가 일치하지 않습니다.');
    }

    const accessToken = jwt.sign(
        {
            userId: user.id,
            userEmail: user.email,
            userNickname: user.nickname,
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: '1h',
        },
    );

    const refreshToken = jwt.sign(
        {
            userId: user.id,
            userEmail: user.email,
            userNickname: user.nickname,
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: '7d',
        },
    );

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
