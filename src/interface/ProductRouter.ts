import express, { Request, Response, NextFunction} from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { create } from 'superstruct';

import { AuthTokenManager } from '../infra/AuthTokenManager.js';
import { asyncErrorHandler } from './utils/asyncErrorHandler.js';
import { AuthN } from './utils/AuthN.js';

import { CreateProductRequestStruct } from './structs/product/CreateProductRequestStruct.js';
import { UpdateProductRequestStruct } from './structs/product/UpdateProductRequestStruct.js';
import { GetProductListRequestStruct } from './structs/product/GetProductListRequestStruct.js';

import { CreateCommentRequestStruct } from './structs/comment/CreateCommentRequestStruct.js';
import { GetCommentListRequestStruct } from './structs/comment/GetCommentListRequestStruct.js';

import { CreateProductHandler } from '../application/product/CreateProductHandler.js';
import { GetProductHandler } from '../application/product/GetProductHandler.js';
import { UpdateProductHandler } from '../application/product/UpdateProductHandler.js';
import { DeleteProductHandler } from '../application/product/DeleteProductHandler.js';
import { GetProductListHandler } from '../application/product/GetProductListHandler.js';

import { CreateProductCommentHandler } from '../application/product/CreateProductCommentHandler.js';
import { GetProductCommentListHandler } from '../application/product/GetProductCommentListHandler.js';

import { CreateProductLikeHandler } from '../application/product/CreateProductLikeHandler.js';
import { DeleteProductLikeHandler } from '../application/product/DeleteProductLikeHandler.js';

export const ProductRouter = express.Router();

// 상품 등록 API
ProductRouter.post(
  '/',
  AuthN(),
  asyncErrorHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const requester = AuthTokenManager.getRequesterFromToken(req.headers.authorization);

    const { name, description, price, tags, images } = create(req.body, CreateProductRequestStruct);

    const productView = await CreateProductHandler.handle(requester, {
      name,
      description,
      price,
      tags,
      images,
    });

    res.status(201).send(productView);
    return;
  }),
);

// 상품 조회 API
ProductRouter.get(
  '/:productId',
  asyncErrorHandler(
    async (
      req: Request<ParamsDictionary & { productId: string }>,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      const requester = AuthTokenManager.getRequesterFromTokenOrDefault(req.headers.authorization);

      const { productId } = req.params;

      const productView = await GetProductHandler.handle(requester, {
        productId: Number(productId),
      });

      res.send(productView);
      return;
    },
  ),
);

// 상품 수정 API
ProductRouter.patch(
  '/:productId',
  AuthN(),
  asyncErrorHandler(
    async (
      req: Request<ParamsDictionary & { productId: string }>,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      const requester = AuthTokenManager.getRequesterFromToken(req.headers.authorization);

      const { productId } = req.params;
      const {
        name = '',
        description = '',
        price = 0,
        tags = [],
        images = [],
      } = create(req.body, UpdateProductRequestStruct);

      const productView = await UpdateProductHandler.handle(requester, {
        productId: Number(productId),
        name,
        description,
        price,
        tags,
        images,
      });

      res.send(productView);
      return;
    },
  ),
);

// 상품 삭제 API
ProductRouter.delete(
  '/:productId',
  AuthN(),
  asyncErrorHandler(
    async (
      req: Request<ParamsDictionary & { productId: string }>,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      const requester = AuthTokenManager.getRequesterFromToken(req.headers.authorization);

      const { productId } = req.params;

      await DeleteProductHandler.handle(requester, {
        productId: Number(productId),
      });

      res.status(204).send();
      return;
    },
  ),
);

// 상품 목록 조회 API
ProductRouter.get(
  '/',
  asyncErrorHandler(async (req: Request<{}, {}, {}, { page?: string; pageSize?: string; orderBy?: string; keyword?: string }>, res: Response, next: NextFunction): Promise<void> => {
    const requester = AuthTokenManager.getRequesterFromTokenOrDefault(req.headers.authorization);

    const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListRequestStruct);

    const productListView = await GetProductListHandler.handle(requester, {
      page,
      pageSize,
      orderBy,
      keyword,
    });

    res.send(productListView);
    return;
  }),
);

// 상품 댓글 등록 API
ProductRouter.post(
  '/:productId/comments',
  AuthN(),
  asyncErrorHandler(
    async (
      req: Request<ParamsDictionary & { productId: string }>,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      const requester = AuthTokenManager.getRequesterFromToken(req.headers.authorization);

      const { productId } = req.params;
      const { content } = create(req.body, CreateCommentRequestStruct);

      const productCommentView = await CreateProductCommentHandler.handle(requester, {
        productId: Number(productId),
        content,
      });

      res.status(201).send(productCommentView);
      return;
    },
  ),
);

// 상품 댓글 목록 조회 API
ProductRouter.get(
  '/:productId/comments',
  asyncErrorHandler(
    async (
      req: Request<ParamsDictionary & { productId: string }, {}, {}, { cursor?: string; limit?: string }>,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      const { productId } = req.params;
      const { cursor, limit } = create(req.query, GetCommentListRequestStruct);

      const productCommentListView = await GetProductCommentListHandler.handle({
        productId: Number(productId),
        cursor,
        limit,
      });

      res.send(productCommentListView);
      return;
    },
  ),
);

// 상품 좋아요 API
ProductRouter.post(
  '/:productId/favorite',
  AuthN(),
  asyncErrorHandler(
    async (
      req: Request<ParamsDictionary & { productId: string }>,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      const requester = AuthTokenManager.getRequesterFromToken(req.headers.authorization);

      const productId = Number(req.params.productId);

      const productView = await CreateProductLikeHandler.handle(requester, {
        productId,
      });

      res.status(201).send(productView);
      return;
    },
  ),
);

// 상품 좋아요 취소 API
ProductRouter.delete(
  '/:productId/favorite',
  AuthN(),
  asyncErrorHandler(
    async (
      req: Request<ParamsDictionary & { productId: string }>,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      const requester = AuthTokenManager.getRequesterFromToken(req.headers.authorization);

      const productId = Number(req.params.productId);

      const productView = await DeleteProductLikeHandler.handle(requester, {
        productId,
      });

      res.status(201).send(productView);
      return;
    },
  ),
);
