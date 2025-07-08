import articleService from "../service/articleService";
import articleLikeService from "../service/articleLikeService";
import { NextFunction, Request, Response, RequestHandler } from "express";
import { ArticleParamsDto } from "../dtos/article.dto";

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
    const userId = req.auth?.userId;

    const result = await articleService.getArticles({
      offset,
      limit,
      search,
      sort,
      userId,
    });

    res.status(200).json({
      articles: result.articles,
      pagination: result.pagination,
      sort: result.sort,
    });
  } catch (error) {
    next(error);
  }
};

// 게시글 상세 조회
const getArticleById = async (
  req: Request<{ articleId: ArticleParamsDto["id"] }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const articleId = req.params.articleId;
    const userId = req.auth?.userId;
    const article = await articleService.getArticleById(articleId, userId);

    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};

// 게시글 생성
const createArticle: RequestHandler = async (req, res, next) => {
  try {
    const { title, content, images } = req.body;
    const userId = req.auth!.userId;

    // 이미지는 이미 S3에 업로드되어 URL로 전달됨
    const imagePaths = images || [];

    const article = await articleService.createArticle({
      title,
      content,
      images: imagePaths,
      userId,
    });

    res
      .status(201)
      .json({ message: "게시글이 성공적으로 등록되었습니다.", article });
  } catch (error) {
    next(error);
  }
};

// 게시글 수정
const updateArticle: RequestHandler = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const { title, content, images } = req.body;

    // 기존 게시글 조회 (이미지 정보 필요)
    const existingArticle = await articleService.getArticleById(articleId);
    const oldImages = existingArticle.images || [];

    // 이미지는 이미 S3에 업로드되어 URL로 전달됨
    const newImages = images || [];

    const data = {
      title,
      content,
      images: newImages,
    };

    // DB 업데이트
    const article = await articleService.updateArticle(articleId, data);

    // 🗑️ 사용하지 않는 기존 이미지들 S3에서 삭제 (비동기)
    const { findImagesToDelete, deleteS3Images } = await import(
      "../utils/s3Helper"
    );
    const imagesToDelete = findImagesToDelete(oldImages, newImages);

    if (imagesToDelete.length > 0) {
      // 비동기로 삭제 처리 (응답 속도에 영향 주지 않음)
      deleteS3Images(imagesToDelete).catch((error) => {
        console.error("이미지 삭제 중 오류:", error);
      });
    }

    res.status(200).json({
      message: "게시글이 성공적으로 수정되었습니다.",
      article,
    });
  } catch (error) {
    next(error);
  }
};

// 게시글 삭제
const deleteArticle = async (
  req: Request<{ articleId: ArticleParamsDto["id"] }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const articleId = req.params.articleId;

    // 삭제 전 게시글 정보 조회 (이미지 정보 필요)
    const existingArticle = await articleService.getArticleById(articleId);
    const imagesToDelete = existingArticle.images || [];

    // DB에서 게시글 삭제
    await articleService.deleteArticle(articleId);

    // 🗑️ 게시글과 관련된 이미지들 S3에서 삭제 (비동기)
    if (imagesToDelete.length > 0) {
      const { deleteS3Images } = await import("../utils/s3Helper");
      deleteS3Images(imagesToDelete).catch((error) => {
        console.error("게시글 삭제 후 이미지 삭제 중 오류:", error);
      });
    }

    res.status(200).json({
      message: "게시글이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    next(error);
  }
};

// 좋아요 누르기
const likeArticle = async (
  req: Request<{ articleId: ArticleParamsDto["id"] }>,
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
  req: Request<{ articleId: ArticleParamsDto["id"] }>,
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
  likeArticle,
  unlikeArticle,
};
