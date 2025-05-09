import * as userService from '../services/userService.js';
import { HttpError } from '../middlewares/HttpError.js';

// userId 유효성 보장 함수
function assertUserId(req) {
    if (!req.userId) {
        throw new HttpError(401, '로그인이 필요합니다');
    }
    return req.userId;
}

// 내 유저정보 가져오기
export const getMe = async (req, res, next) => {
    try {
        const userId = assertUserId(req);
        const user = await userService.getMe(userId);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

// 내 프로필 이미지 업데이트
export const updateMe = async (req, res, next) => {
    try {
        const userId = assertUserId(req);

        const { image } = req.body;
        if (typeof image !== 'string' || image.trim() === '') {
            throw new HttpError(400, '유효한 이미지 URL을 입력해주세요');
        }

        const updatedUser = await userService.updateMe(userId, { image });
        res.status(200).json(updatedUser);
    } catch (err) {
        next(err);
    }
};

// 내 비밀번호 업데이트
export const updateMyPassword = async (req, res, next) => {
    try {
        const userId = assertUserId(req);

        const { currentPassword, password, passwordConfirmation } = req.body;

        if (typeof currentPassword !== 'string' || currentPassword.trim() === '') {
            throw new HttpError(400, '현재 비밀번호를 입력해주세요');
        }
        if (typeof password !== 'string' || password.trim() === '') {
            throw new HttpError(400, '새 비밀번호를 입력해주세요');
        }
        if (typeof passwordConfirmation !== 'string' || passwordConfirmation.trim() === '') {
            throw new HttpError(400, '비밀번호 확인을 입력해주세요');
        }
        if (password !== passwordConfirmation) {
            throw new HttpError(400, '새 비밀번호와 비밀번호 확인이 일치하지 않습니다');
        }

        const updatedUser = await userService.updateMyPassword(userId, {
            currentPassword,
            password,
            passwordConfirmation,
        });
        res.status(200).json(updatedUser);
    } catch (err) {
        next(err);
    }
};
export const getMyProduct = async (req, res, next) => {};
export const getMyFavorites = async (req, res, next) => {};
