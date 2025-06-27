import commentService from "../services/commentService";
import auth from "../middlewares/auth";
import itemService from "../services/itemService";
import express, { Request, Response, NextFunction } from "express";
import uploads from "../middlewares/multer";
import { TError } from "../types/error";
import { CreateItemDto, UpdateItemDto } from "../dtos/item.dto";
import { CreateCommentDto } from "../dtos/comment.dto";

const itemController = express.Router();

/**
 * @swagger
 * /items:
 *   get:
 *     summary: 상품 목록 조회
 *     tags: [Item]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 검색 키워드
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *         description: 정렬 기준
 *     responses:
 *       200:
 *         description: 상품 목록 반환
 */
itemController.get(
  "/",
  async (
    req: Request<
      {},
      {},
      {},
      { keyword: string; orderBy: "recent" | "favorite" }
    >,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { keyword, orderBy } = req.query;
      const items = await itemService.getItems(keyword, orderBy);
      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: 상품 상세 조회
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 상품 정보 반환
 */
itemController.get(
  "/:id",
  auth.verifyAccessToken,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const userId = req.auth?.userId as string;
      const items = await itemService.getById(id, userId);
      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /items:
 *   post:
 *     summary: 상품 등록
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: 상품 생성됨
 */
itemController.post(
  "/",
  uploads.array("images", 3),
  auth.verifyAccessToken,
  async (
    req: Request<{}, {}, CreateItemDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let { name, description, price, tags } = req.body;
      const userId = req.auth?.userId as string;
      if (!name || !description || !price) {
        const error = new Error("모두 필요합니다.") as TError;
        error.code = 422;
        throw error;
      }
      price = Number(price);
      if (!tags) {
        tags = [];
      } else if (typeof tags === "string") {
        tags = JSON.parse(tags);
      }
      let imagePaths = [] as string[];
      const files = req.files as Express.MulterS3.File[];
      if (files.length > 0) {
        imagePaths = files.map((file) => file.location);
      }
      const item = await itemService.createItem({
        name,
        description,
        price,
        tags,
        images: imagePaths,
        userId,
      });
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /items/{id}:
 *   patch:
 *     summary: 상품 수정
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: 상품 수정 완료
 */
itemController.patch(
  "/:id",
  auth.verifyAccessToken,
  uploads.array("images", 3),
  async (
    req: Request<{ id: string }, {}, UpdateItemDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      let { name, description, price, tags } = req.body;
      const userId = req.auth?.userId as string;
      const item = await itemService.getById(id, userId);
      if (!item) {
        const error = new Error(
          "수정하려는 물건이 존재하지 않습니다."
        ) as TError;
        error.code = 422;
        throw error;
      }
      if (item.userId !== userId) {
        const error = new Error(
          "권한이 없습니다.-작성자가 아닙니다."
        ) as TError;
        error.code = 401;
        throw error;
      }
      price = Number(price);
      if (!tags) {
        tags = [];
      } else if (typeof tags === "string") {
        tags = JSON.parse(tags);
      }
      let imagePaths = item.images;
      const files = req.files as Express.MulterS3.File[];
      if (files.length > 0) {
        imagePaths = files.map((file) => file.location);
      }
      const updatedItem = await itemService.patchItem(id, {
        name,
        description,
        price,
        tags,
        images: imagePaths,
      });
      res.status(201).json(updatedItem);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: 상품 삭제
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: 상품 삭제 완료
 */
itemController.delete(
  "/:id",
  auth.verifyAccessToken,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const userId = req.auth?.userId as string;

      const item = await itemService.getById(id, userId);
      if (!item) {
        const error = new Error(
          "삭제하려는 물건이 존재하지 않습니다."
        ) as TError;
        error.code = 422;
        throw error;
      }
      if (item.userId !== userId) {
        const error = new Error(
          "권한이 없습니다.-작성자가 아닙니다."
        ) as TError;
        error.code = 401;
        throw error;
      }
      await itemService.deleteItem(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /items/{id}/comments:
 *   post:
 *     summary: 상품에 댓글 추가
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: 댓글 등록 완료
 */
itemController.post(
  "/:id/comments",
  auth.verifyAccessToken,
  async (
    req: Request<{ id: string }, {}, CreateCommentDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const { content } = req.body;
      const userId = req.auth?.userId as string;
      if (!content) {
        const error = new Error("내용 필요합니다.") as TError;
        error.code = 422;
        throw error;
      }
      const type = "item";
      const comment = await commentService.createComment(
        type,
        id,
        userId,
        content
      );
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /items/{id}/favorite:
 *   post:
 *     summary: 상품 좋아요 추가
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: 좋아요 추가됨
 */
itemController.post(
  "/:id/favorite",
  auth.verifyAccessToken,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const userId = req.auth?.userId as string;
      const createdFavorite = await itemService.postFavorite(id, userId);
      res.status(201).json(createdFavorite);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /items/{id}/favorite:
 *   delete:
 *     summary: 상품 좋아요 취소
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: 좋아요 취소됨
 */
itemController.delete(
  "/:id/favorite",
  auth.verifyAccessToken,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const userId = req.auth?.userId as string;
      const deletedFavorite = await itemService.deleteFavorite(id, userId);
      res.status(201).json(deletedFavorite);
    } catch (error) {
      next(error);
    }
  }
);

export default itemController;
