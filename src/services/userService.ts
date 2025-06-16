//import * as productRepository from '../repositories/productRepository.js';
import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/userRepository.js';
import { HttpError } from '../middlewares/HttpError.js';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';

export const getMe = async (id: number) => {
    // 유저 존재 확인
    const user = await userRepository.findById(id);
    if (!user) {
        throw new HttpError(404, '해당 유저를 찾을 수 없습니다');
    }

    return {
        user: {
            id: user.id,
            image: user.image,
            nickname: user.nickname,
            updatedAt: user.updatedAt,
            createdAt: user.createdAt,
        },
    };
};

export const updateMe = async (id: number, data: { image: User['image'] }) => {
    const user = await userRepository.findById(id);
    if (!user) {
        throw new HttpError(404, '해당 유저를 찾을 수 없습니다');
    }
    const updatedUser = await userRepository.updateImg(id, data);

    return {
        user: {
            id: updatedUser.id,
            image: updatedUser.image,
            nickname: updatedUser.nickname,
            updatedAt: updatedUser.updatedAt,
            createdAt: updatedUser.createdAt,
        },
    };
};

export const updateMyPassword = async (id: number, data: { password: User['password'] }) => {
    // 유저 존재 확인
    const user = await userRepository.findById(id);
    if (!user) {
        throw new HttpError(404, '해당 유저를 찾을 수 없습니다');
    }

    // 현재 비밀번호 확인
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
        throw new HttpError(401, '현재 비밀번호가 일치하지 않습니다.');
    }

    // 새 비밀번호 해싱 후 업데이트
    const updatedUser = await userRepository.update(id, data);

    return {
        user: {
            id: updatedUser.id,
            image: updatedUser.image,
            nickname: updatedUser.nickname,
            updatedAt: updatedUser.updatedAt,
            createdAt: updatedUser.createdAt,
        },
    };
};

// 유저 게시글
export const getMyArticle = async (id: number) => {
    const user = await userRepository.userArticles(id);
    if (!user) throw new HttpError(404, '해당 유저를 찾을 수 없습니다');
    return user.articles; // ✅ 수정됨
};

// 유저 프로덕트
export const getMyProduct = async (id: number) => {
    const user = await userRepository.userProduct(id);
    if (!user) throw new HttpError(404, '해당 유저를 찾을 수 없습니다');
    return user.products; // ✅ 수정됨
};

// 유저 좋아요 목록
export const getMyFavorites = async (id: number) => {
    const user = await userRepository.userFavorites(id);
    if (!user) throw new HttpError(404, '해당 유저를 찾을 수 없습니다');
    return user.myLikes; // ✅ 그대로 OK
};
