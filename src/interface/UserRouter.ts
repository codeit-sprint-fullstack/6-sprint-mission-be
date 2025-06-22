import express, { Request, Response, NextFunction } from 'express';
import { create } from 'superstruct';

import { AuthTokenManager } from '../infra/AuthTokenManager.js';
import { asyncErrorHandler } from './utils/asyncErrorHandler.js';
import { AuthN } from './utils/AuthN.js';

import { UpdateProfileRequestStruct } from './structs/user/UpdateProfileRequestStruct.js';
import { UpdatePasswordRequestStruct } from './structs/user/UpdatePasswordRequestStruct.js';
import { GetMyProductListRequestStruct } from './structs/user/GetMyProductListRequestStruct.js';
import { GetMyFavoritesProductListRequestStruct } from './structs/user/GetMyFavoritesProductListRequestStruct.js';

import { GetUserProfileHandler } from '../application/user/GetUserProfileHandler.js';
import { UpdateUserProfileHandler } from '../application/user/UpdateUserProfileHandler.js';
import { UpdateUserPasswordHandler } from '../application/user/UpdateUserPasswordHandler.js';
import { GetUserProductListHandler } from '../application/user/GetUserProductListHandler.js';
import { GetUserFavoriteListHandler } from '../application/user/GetUserFavoriteListHandler.js';

export const UserRouter = express.Router();

// requester 타입 선언 (AuthN 미들웨어가 추가해주는 userId 포함)
declare global {
  namespace Express {
    interface Request {
      requester?: { userId: number };
    }
  }
}

// 내 정보 조회하기 API
UserRouter.get(
  '/me',
  AuthN(),
  asyncErrorHandler(async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    // 토큰에서 requester 정보 추출
    const requester = AuthTokenManager.getRequesterFromToken(req.headers.authorization);
    const userView = await GetUserProfileHandler.handle(requester);

    res.send(userView);
    return;
  }),
);

// 내 정보 수정하기 API
UserRouter.patch(
  '/me',
  AuthN(),
  asyncErrorHandler(async (
    req: Request<{}, {}, { image: string | null }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const requester = AuthTokenManager.getRequesterFromToken(req.headers.authorization);

    // 검증 및 구조분해 할당
    const { image } = create(req.body, UpdateProfileRequestStruct);

    // null일 수 있으므로 빈 문자열 처리 (핸들러 요구 타입에 따라 조절)
    const safeImage = image ?? '';

    const userView = await UpdateUserProfileHandler.handle(requester, {
      image: safeImage,
    });

    res.send(userView);
    return;
  }),
);

// 내 패스워드 수정하기 API
UserRouter.patch(
  '/me/password',
  AuthN(),
  asyncErrorHandler(async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const requester = AuthTokenManager.getRequesterFromToken(req.headers.authorization);

    const {
      password,
      passwordConfirmation,
      currentPassword,
    } = create(req.body, UpdatePasswordRequestStruct);

    const userView = await UpdateUserPasswordHandler.handle(requester, {
      password,
      passwordConfirmation,
      currentPassword,
    });

    res.send(userView);
    return;
  }),
);

// 내가 등록한 상품 조회하기 API
UserRouter.get(
  '/me/products',
  AuthN(),
  asyncErrorHandler(async (
    req: Request<{}, {}, {}, { page?: string; pageSize?: string; keyword?: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const requester = AuthTokenManager.getRequesterFromToken(req.headers.authorization);

    const { page, pageSize, keyword } = create(req.query, GetMyProductListRequestStruct);

    const productListView = await GetUserProductListHandler.handle(requester, {
      page,
      pageSize,
      keyword,
    });

    res.send(productListView);
    return;
  }),
);

// 내가 좋아요한 상품 조회하기 API
UserRouter.get(
  '/me/favorites',
  AuthN(),
  asyncErrorHandler(async (
    req: Request<{}, {}, {}, { page?: string; pageSize?: string; keyword?: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const requester = AuthTokenManager.getRequesterFromToken(req.headers.authorization);

    const { page, pageSize, keyword } = create(req.query, GetMyFavoritesProductListRequestStruct);

    const favoriteListView = await GetUserFavoriteListHandler.handle(requester, {
      page,
      pageSize,
      keyword,
    });

    res.send(favoriteListView);
    return;
  }),
);
