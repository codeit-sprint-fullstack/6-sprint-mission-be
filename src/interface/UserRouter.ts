import express, { Request, Response } from 'express';
import { create } from 'superstruct';

import { AuthTokenManager } from '../infra/AuthTokenManager';

import { asyncErrorHandler } from './utils/asyncErrorHandler';
import { AuthN } from './utils/AuthN';

import { UpdateProfileRequestStruct } from './structs/user/UpdateProfileRequestStruct';
import { UpdatePasswordRequestStruct } from './structs/user/UpdatePasswordRequestStruct';
import { GetMyProductListRequestStruct } from './structs/user/GetMyProductListRequestStruct';
import { GetMyFavoritesProductListRequestStruct } from './structs/user/GetMyFavoritesProductListRequestStruct';
import { GetUserProfileHandler } from '../application/user/GetUserProfileHandler';
import { UpdateUserProfileHandler } from '../application/user/UpdateUserProfileHandler';
import { UpdateUserPasswordHandler } from '../application/user/UpdateUserPasswordHandler';
import { GetUserProductListHandler } from '../application/user/GetUserProductListHandler';
import { GetUserFavoriteListHandler } from '../application/user/GetUserFavoriteListHandler';
import { User } from '@prisma/client';

export const UserRouter = express.Router();

// 내 정보 조회하기 api
UserRouter.get(
    '/me',
    AuthN(),
    asyncErrorHandler(async (req: Request, res: Response) => {
        const requester = AuthTokenManager.getRequesterFromToken(req.headers.authorization);

        const userView = await GetUserProfileHandler.handle(requester);

        return res.send(userView);
    }),
);

// 내 정보 수정하기 api
UserRouter.patch(
    '/me',
    AuthN(),
    asyncErrorHandler(async (req: Request<{}, {}, {image: string | null}>, res: Response) => {
        const requester = AuthTokenManager.getRequesterFromToken(req.headers.authorization);

        const { image } = create(req.body, UpdateProfileRequestStruct);

        const userView = await UpdateUserProfileHandler.handle(requester, {
            image,
        });

        return res.send(userView);
    }),
);

// 내 패스워드 수정하기 api
UserRouter.patch(
    '/me/password',
    AuthN(),
    asyncErrorHandler(async (req: Request, res: Response) => {
        const requester = AuthTokenManager.getRequesterFromToken(req.headers.authorization);

        const { password, passwordConfirmation, currentPassword } = create(
            req.body,
            UpdatePasswordRequestStruct,
        );

        const userView = await UpdateUserPasswordHandler.handle(requester, {
            password,
            passwordConfirmation,
            currentPassword,
        });

        return res.send(userView);
    }),
);

// 내가 등록한 상품 조회하기 api
UserRouter.get(
    '/me/products',
    AuthN(),
    asyncErrorHandler(async (req: Request, res: Response) => {
        const requester = AuthTokenManager.getRequesterFromToken(req.headers.authorization);

        const { page, pageSize, keyword } = create(req.query, GetMyProductListRequestStruct);

        const productListView = await GetUserProductListHandler.handle(requester, {
            page,
            pageSize,
            keyword,
        });

        return res.send(productListView);
    }),
);

// 내가 좋아요한 상품 조회하기 api
UserRouter.get(
    '/me/favorites',
    AuthN(),
    asyncErrorHandler(async (req: Request, res: Response) => {
        const requester = AuthTokenManager.getRequesterFromToken(req.headers.authorization);

        const { page, pageSize, keyword } = create(
            req.query,
            GetMyFavoritesProductListRequestStruct,
        );

        const favoriteListView = await GetUserFavoriteListHandler.handle(requester, {
            page,
            pageSize,
            keyword,
        });

        return res.send(favoriteListView);
    }),
);
