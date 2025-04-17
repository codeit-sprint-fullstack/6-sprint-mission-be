import express from "express";
import { prisma } from "../db/prisma/client.prisma.js";

const articlesRouter = express.Router();

// 특정 게시글 상세 조회
articlesRouter.get("/:articleId", async (req, res, next) => {
  try {
    const articleId = req.params.articleId;

    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        likes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!article) {
      return res.status(404).json({
        message: "게시글을 찾을 수 없습니다.",
      });
    }

    res.status(200).json({
      data: article,
    });
  } catch (error) {
    next(error);
  }
});

// 새 게시글 작성
articlesRouter.post("/", async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const article = await prisma.article.create({
      data: {
        title,
        content,
        likes: 0,
      },
    });

    res.status(201).json({
      message: "게시글이 성공적으로 등록되었습니다.",
      data: article,
    });
  } catch (error) {
    next(error);
  }
});

// 게시글 목록 조회 (검색 및 페이지네이션)
articlesRouter.get("/", async (req, res, next) => {
  try {
    const skip = Number(req.query.offset) || 0;
    const take = Number(req.query.limit) || 10;
    const search = req.query.search;

    const sort = req.query.sort || "latest"; // 기본 정렬은 최신순

    const options = {
      skip,
      take,
      select: {
        id: true,
        title: true,
        content: true,
        likes: true,
        createdAt: true,
        updatedAt: true,
      },
    };

    // 정렬 옵션 설정
    if (sort === "popular") {
      // 인기순(좋아요 많은 순)으로 정렬
      options.orderBy = { likes: "desc" };
    } else {
      // 최신순으로 정렬 (기본값)
      options.orderBy = { createdAt: "desc" };
    }

    // 검색 조건 설정
    if (search) {
      options.where = {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      };
    }

    const [articles, total] = await prisma.$transaction([
      prisma.article.findMany(options),
      prisma.article.count({
        where: options.where,
      }),
    ]);

    res.status(200).json({
      data: articles,
      pagination: {
        total,
        offset: skip,
        limit: take,
        hasMore: total > skip + take,
      },
      sort, // 현재 적용된 정렬 방식을 응답에 포함
    });
  } catch (error) {
    next(error);
  }
});

// 게시글 수정
articlesRouter.patch("/:articleId", async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const { title, content } = req.body;

    const article = await prisma.article.update({
      where: { id: articleId },
      data: { title, content },
      select: {
        id: true,
        title: true,
        content: true,
        likes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      message: "게시글이 성공적으로 수정되었습니다.",
      data: article,
    });
  } catch (err) {
    if (err.name === "PrismaClientKnownRequestError" && err.code === "P2025") {
      return res.status(404).json({
        message: "게시글을 찾을 수 없습니다.",
      });
    }
    next(err);
  }
});

// 게시글 삭제
articlesRouter.delete("/:articleId", async (req, res, next) => {
  try {
    const articleId = req.params.articleId;

    await prisma.article.delete({
      where: { id: articleId },
    });

    res.status(200).json({
      message: "게시글이 성공적으로 삭제되었습니다.",
    });
  } catch (err) {
    if (err.name === "PrismaClientKnownRequestError" && err.code === "P2025") {
      return res.status(404).json({
        message: "게시글을 찾을 수 없습니다.",
      });
    }
    next(err);
  }
});

// 특정 게시글의 댓글 목록 조회
articlesRouter.get("/:articleId/comments", async (req, res, next) => {
  try {
    const articleId = req.params.articleId;

    const comments = await prisma.comment.findMany({
      where: { articleId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      data: comments,
    });
  } catch (err) {
    if (err.name === "PrismaClientKnownRequestError" && err.code === "P2025") {
      return res.status(404).json({
        message: "댓글에 해당하는 게시글을 찾을 수 없습니다.",
      });
    }
    next(err);
  }
});

// 특정 게시글에 댓글 작성
articlesRouter.post("/:articleId/comments", async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const { content } = req.body;

    // 게시글 존재 여부 확인
    await prisma.article.findUniqueOrThrow({
      where: { id: articleId },
    });

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId,
      },
    });

    res.status(201).json({
      message: "댓글이 성공적으로 등록되었습니다.",
      data: comment,
    });
  } catch (err) {
    if (err.name === "PrismaClientKnownRequestError") {
      if (err.code === "P2025") {
        return res.status(404).json({
          message: "게시글을 찾을 수 없습니다.",
        });
      }
    }
    next(err);
  }
});

// 댓글 수정
articlesRouter.patch(
  "/:articleId/comments/:commentId",
  async (req, res, next) => {
    try {
      const commentId = req.params.commentId;
      const { content } = req.body;

      const comment = await prisma.comment.update({
        where: { id: commentId },
        data: { content },
      });

      res.status(200).json({
        message: "댓글이 성공적으로 수정되었습니다.",
        data: comment,
      });
    } catch (err) {
      if (
        err.name === "PrismaClientKnownRequestError" &&
        err.code === "P2025"
      ) {
        return res.status(404).json({
          message: "댓글을 찾을 수 없습니다.",
        });
      }
      next(err);
    }
  }
);

// 댓글 삭제
articlesRouter.delete(
  "/:articleId/comments/:commentId",
  async (req, res, next) => {
    try {
      const commentId = req.params.commentId;

      await prisma.comment.delete({
        where: { id: commentId },
      });

      res.status(200).json({
        message: "댓글이 성공적으로 삭제되었습니다.",
      });
    } catch (err) {
      if (
        err.name === "PrismaClientKnownRequestError" &&
        err.code === "P2025"
      ) {
        return res.status(404).json({
          message: "댓글을 찾을 수 없습니다.",
        });
      }
      next(err);
    }
  }
);

// 특정 게시글 좋아요 증가
articlesRouter.patch("/:articleId/like", async (req, res, next) => {
  try {
    const articleId = req.params.articleId;

    // 현재 게시글 조회
    const article = await prisma.article.findUniqueOrThrow({
      where: { id: articleId },
    });

    // 좋아요 수 증가
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        likes: (article.likes || 0) + 1,
      },
      select: {
        id: true,
        title: true,
        content: true,
        likes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      message: "게시글에 좋아요를 눌렀습니다.",
      data: updatedArticle,
    });
  } catch (err) {
    if (err.name === "PrismaClientKnownRequestError" && err.code === "P2025") {
      return res.status(404).json({
        message: "게시글을 찾을 수 없습니다.",
      });
    }
    next(err);
  }
});

export default articlesRouter;
