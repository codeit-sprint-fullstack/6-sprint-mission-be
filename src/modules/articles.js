import express from 'express';
import { prisma } from '../db/prisma/client.prisma.js';

const articlesRouter = express.Router();

articlesRouter.get('/:articleId', async (req, res, next) => {
  try {
    const articleId = req.params.articleId;

    const aricle = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    if (!aricle) throw new Error('No articles found');

    res.status(200).json(aricle);
  } catch (error) {
    next(error);
  }
});

articlesRouter.post('/', async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const aricle = await prisma.article.create({
      data: {
        title,
        content,
      },
    });

    res.status(201).json(aricle);
  } catch (error) {
    next(error);
  }
});

articlesRouter.get('/', async (req, res, next) => {
  try {
    const skip = Number(req.query.offset);
    const search = req.query.search;

    const options = {};

    // 정렬
    options.orderBy = { createdAt: 'desc' };

    // offset
    if (skip) options.skip = skip;

    // .검색

    if (search) {
      options.where = {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      };
    }

    const aricle = await prisma.article.findMany(options);

    res.status(201).json(aricle);
  } catch (error) {
    next(error);
  }
});

articlesRouter.patch('/:articleId', async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const { title, content } = req.body;

    const aricle = await prisma.article.update({
      where: { id: articleId },
      data: { title, content },
    });

    if (!aricle) throw new Error('No articles found');

    res.status(200).json(aricle);
  } catch (err) {
    if (err.name === 'PrismaClientKnownRequestError' && err.code === 'P2025') {
      return res.status(404).json({
        message: 'Article을 찾을 수 없습니다.',
      });
    }
    next(err);
  }
});

articlesRouter.delete('/:articleId', async (req, res, next) => {
  try {
    const articleId = req.params.articleId;

    await prisma.article.delete({
      where: { id: articleId },
    });

    res.status(200).json({
      message: '게시글이 성공적으로 삭제되었습니다.',
    });
  } catch (err) {
    if (err.name === 'PrismaClientKnownRequestError' && err.code === 'P2025') {
      return res.status(404).json({
        message: '게시글을 찾을 수 없습니다.',
      });
    }
    next(err);
  }
});

articlesRouter.get('/:articleId/comments', async (req, res, next) => {
  try {
    const articleId = req.params.articleId;

    const comments = await prisma.comment.findMany({
      where: { articleId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      data: comments,
    });
  } catch (err) {
    if (err.name === 'PrismaClientKnownRequestError' && err.code === 'P2025') {
      return res.status(404).json({
        message: '댓글에 해당하는 게시글을 찾을 수 없습니다.',
      });
    }
    next(err);
  }
});

articlesRouter.post('/:articleId/comments', async (req, res, next) => {
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
      message: '댓글이 성공적으로 등록되었습니다.',
      data: comment,
    });
  } catch (err) {
    if (err.name === 'PrismaClientKnownRequestError') {
      if (err.code === 'P2025') {
        return res.status(404).json({
          message: '게시글을 찾을 수 없습니다.',
        });
      }
    }
    next(err);
  }
});

articlesRouter.patch(
  '/:articleId/comments/:commentId',
  async (req, res, next) => {
    try {
      const commentId = req.params.commentId;
      const { content } = req.body;

      const comment = await prisma.comment.update({
        where: { id: commentId },
        data: { content },
      });

      res.status(200).json({
        message: '댓글이 성공적으로 수정되었습니다.',
        data: comment,
      });
    } catch (err) {
      if (
        err.name === 'PrismaClientKnownRequestError' &&
        err.code === 'P2025'
      ) {
        return res.status(404).json({
          message: '댓글을 찾을 수 없습니다.',
        });
      }
      next(err);
    }
  }
);

articlesRouter.delete(
  '/:articleId/comments/:commentId',
  async (req, res, next) => {
    try {
      const commentId = req.params.commentId;

      await prisma.comment.delete({
        where: { id: commentId },
      });

      res.status(200).json({
        message: '댓글이 성공적으로 삭제되었습니다.',
      });
    } catch (err) {
      if (
        err.name === 'PrismaClientKnownRequestError' &&
        err.code === 'P2025'
      ) {
        return res.status(404).json({
          message: '댓글을 찾을 수 없습니다.',
        });
      }
      next(err);
    }
  }
);

export default articlesRouter;
