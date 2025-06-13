import articleService from "../service/articleService";
import articleLikeService from "../service/articleLikeService";
import { NextFunction, Request, Response, RequestHandler } from "express";
import { Article } from "@prisma/client";

// 게시글 목록 조회
const getArticles = async (
  req: Request<
    {},
    {},
    {},
    {
      offset?: string;
      limit?: string;
      search?: string;
      sort?: string;
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const offset = parseInt(req.query.offset || "0");
    const limit = parseInt(req.query.limit || "10");
    const { search = "", sort = "latest" } = req.query;
    const userId = req.auth!.userId;

    const result = await articleService.getArticles({
      offset,
      limit,
      search,
      sort,
      userId,
    });

    res.status(200).json({
      data: result.articles,
      pagination: result.pagination,
      sort: result.sort,
    });
  } catch (error) {
    next(error);
  }
};

// 게시글 상세 조회
const getArticleById = async (
  req: Request<{ articleId: Article["id"] }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const articleId = req.params.articleId;
    const userId = req.auth!.userId;
    const article = await articleService.getArticleById(articleId, userId);

    res.status(200).json({ data: article });
  } catch (error) {
    next(error);
  }
};

// 게시글 생성
const createArticle: RequestHandler = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const userId = req.auth!.userId;
    const files = req.files as Express.Multer.File[];
    const imagePaths = files?.map((file) => `/uploads/${file.filename}`) || [];

    const article = await articleService.createArticle({
      title,
      content,
      userId,
      image: imagePaths,
    });
    res
      .status(201)
      .json({ message: "게시글이 성공적으로 등록되었습니다.", data: article });
  } catch (error) {
    next(error);
  }
};

// 게시글 수정
const updateArticle: RequestHandler = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const { title, content, existingImages } = req.body;
    const files = req.files as Express.Multer.File[];

    // 새 이미지 경로 처리
    const newImagePaths =
      files?.map((file) => `/uploads/${file.filename}`) || [];

    // 기존 이미지 처리
    let existingImagePaths = [];
    if (existingImages) {
      try {
        existingImagePaths =
          typeof existingImages === "string"
            ? JSON.parse(existingImages)
            : existingImages;
      } catch (e) {
        existingImagePaths = [];
      }
    }

    // 최종 이미지 경로 배열
    const finalImagePaths = [...existingImagePaths, ...newImagePaths];

    const data = {
      title,
      content,
      image: finalImagePaths,
    };

    const article = await articleService.updateArticle(articleId, data);

    res.status(200).json({
      message: "게시글이 성공적으로 수정되었습니다.",
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// 게시글 삭제
const deleteArticle = async (
  req: Request<{ articleId: Article["id"] }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const articleId = req.params.articleId;
    await articleService.deleteArticle(articleId);

    res.status(200).json({
      message: "게시글이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    next(error);
  }
};

// 좋아요 증가
// const increaseLike = async (
//   req: Request<{ articleId: Article["id"] }>,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const articleId = req.params.articleId;
//     const updatedArticle = await articleService.increaseLike(articleId);

//     res.status(200).json({
//       message: "게시글에 좋아요를 눌렀습니다.",
//       data: updatedArticle,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// 좋아요 누르기
const likeArticle = async (
  req: Request<{ articleId: Article["id"] }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { articleId } = req.params;
    const userId = req.auth!.userId;

    const result = await articleLikeService.likeArticle(userId, articleId);

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// 좋아요 취소
const unlikeArticle = async (
  req: Request<{ articleId: Article["id"] }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { articleId } = req.params;
    const userId = req.auth!.userId;

    const result = await articleLikeService.unlikeArticle(userId, articleId);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export default {
  getArticleById,
  createArticle,
  getArticles,
  updateArticle,
  deleteArticle,
  // increaseLike,
  likeArticle,
  unlikeArticle,
};
