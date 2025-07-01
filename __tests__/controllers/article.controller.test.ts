import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
// Prisma 클라이언트를 목킹하기 위해 실제 경로 대신 목킹된 모듈을 가져올 것입니다.
import prisma from '../../src/models/prisma/prismaClient'; // 실제 경로를 사용합니다.
import {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  likeArticle,
  unlikeArticle,
} from '../../src/controllers/article.controller';

// --- Prisma Client 목킹 ---
// Prisma Client 전체를 목킹합니다. 컨트롤러가 사용하는 모든 메서드를 정의해야 합니다.
jest.mock('../../src/models/prisma/prismaClient', () => ({
  article: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));
// --- Prisma Client 목킹 끝 ---

// `catchAsync` 유틸리티 목킹 (실제 비동기 로직 대신 단순화)
jest.mock('../../src/utils/catchAsync', () => (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  try {
    return Promise.resolve(fn(req, res, next)).catch(next);
  } catch (error) {
    next(error);
  }
});

const app = express();
app.use(express.json());

// --- 인증 미들웨어 목킹 추가 ---
// `req.user`를 설정해주는 가짜 미들웨어
const mockAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  (req as any).user = { id: 'test-user-id' }; // 가상의 사용자 ID 설정 (문자열)
  next();
};
// --- 인증 미들웨어 목킹 추가 끝 ---

// 테스트용 라우터 설정 (실제 라우터처럼 동작하도록)
// createArticle 라우트에 mockAuthMiddleware를 적용합니다.
app.post('/articles', mockAuthMiddleware, createArticle);
app.get('/articles', getAllArticles);
app.get('/articles/:articleId', getArticleById);
app.put('/articles/:articleId', updateArticle);
app.delete('/articles/:articleId', deleteArticle);
app.post('/articles/:articleId/like', likeArticle);
app.delete('/articles/:articleId/unlike', unlikeArticle);

// 에러 핸들링 미들웨어 (테스트 시 에러를 잡아내기 위함)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.statusCode || 500).send({ message: err.message || 'Internal Server Error' });
});


describe('Article Controller', () => {
  let mockArticle: any;
  let mockArticles: any[];

  beforeEach(() => {
    // 각 테스트 전에 모든 목킹된 함수들을 초기화하고 가상의 데이터를 설정합니다.
    jest.clearAllMocks();
    mockArticle = { id: 1, title: 'Test Article', content: 'This is a test content.', userId: 'test-user-id' };
    mockArticles = [
      { id: 1, title: 'Article One', content: 'Content 1' },
      { id: 2, title: 'Article Two', content: 'Content 2' },
    ];
  });

  // --- createArticle 테스트 ---
  describe('createArticle', () => {
    test('새로운 게시글을 성공적으로 생성해야 합니다 (상태 코드 201)', async () => {
      (prisma.article.create as jest.Mock).mockResolvedValue(mockArticle);

      const res = await request(app)
        .post('/articles')
        .send({ title: 'Test Article', content: 'This is a test content.' });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(mockArticle);
      expect(prisma.article.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Article',
          content: 'This is a test content.',
          userId: 'test-user-id', // 목킹된 미들웨어에서 주입된 userId
        },
      });
    });

    test('게시글 생성 실패 시 에러를 반환해야 합니다', async () => {
      const errorMessage = 'Invalid data provided';
      (prisma.article.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const res = await request(app)
        .post('/articles')
        .send({ title: 'Invalid Article' });

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual(errorMessage);
    });
  });

  // --- getAllArticles 테스트 ---
  describe('getAllArticles', () => {
    test('모든 게시글을 성공적으로 가져와야 합니다 (상태 코드 200)', async () => {
      (prisma.article.findMany as jest.Mock).mockResolvedValue(mockArticles);

      const res = await request(app).get('/articles');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockArticles);
      expect(prisma.article.findMany).toHaveBeenCalledTimes(1);
    });

    test('게시글 조회 실패 시 에러를 반환해야 합니다', async () => {
      const errorMessage = 'Database connection error';
      (prisma.article.findMany as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const res = await request(app).get('/articles');

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual(errorMessage);
    });
  });

  // --- getArticleById 테스트 ---
  describe('getArticleById', () => {
    test('ID로 게시글을 성공적으로 가져와야 합니다 (상태 코드 200)', async () => {
      (prisma.article.findUnique as jest.Mock).mockResolvedValue(mockArticle);

      const res = await request(app).get(`/articles/${mockArticle.id}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockArticle);
      expect(prisma.article.findUnique).toHaveBeenCalledWith({
        where: { id: mockArticle.id },
      });
    });

    test('게시글을 찾을 수 없을 때 404를 반환해야 합니다', async () => {
      (prisma.article.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/articles/999');

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Article not found');
      expect(prisma.article.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });

    test('게시글 조회 실패 시 에러를 반환해야 합니다', async () => {
      const errorMessage = 'Prisma query error';
      (prisma.article.findUnique as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const res = await request(app).get('/articles/invalidId');

      expect(res.statusCode).toEqual(500); // parseInt가 NaN을 반환하고, catchAsync에서 에러 처리
      expect(res.body.message).toEqual(errorMessage);
    });
  });

  // --- updateArticle 테스트 ---
  describe('updateArticle', () => {
    test('게시글을 성공적으로 업데이트해야 합니다 (상태 코드 200)', async () => {
      const updatedMockArticle = { ...mockArticle, title: 'Updated Title' };
      (prisma.article.update as jest.Mock).mockResolvedValue(updatedMockArticle);

      const res = await request(app)
        .put(`/articles/${mockArticle.id}`)
        .send({ title: 'Updated Title' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(updatedMockArticle);
      expect(prisma.article.update).toHaveBeenCalledWith({
        where: { id: mockArticle.id },
        data: { title: 'Updated Title' },
      });
    });

    test('게시글 업데이트 실패 시 에러를 반환해야 합니다', async () => {
      const errorMessage = 'Article not found for update';
      (prisma.article.update as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const res = await request(app)
        .put('/articles/999')
        .send({ title: 'Non-existent Article' });

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual(errorMessage);
    });
  });

  // --- deleteArticle 테스트 ---
  describe('deleteArticle', () => {
    test('게시글을 성공적으로 삭제해야 합니다 (상태 코드 204)', async () => {
      (prisma.article.delete as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app).delete(`/articles/${mockArticle.id}`);

      expect(res.statusCode).toEqual(204);
      expect(res.body).toEqual({}); // 204 No Content는 응답 본문이 비어있어야 합니다.
      expect(prisma.article.delete).toHaveBeenCalledWith({
        where: { id: mockArticle.id },
      });
    });

    test('게시글 삭제 실패 시 에러를 반환해야 합니다', async () => {
      const errorMessage = 'Article not found for deletion';
      (prisma.article.delete as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const res = await request(app).delete('/articles/999');

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual(errorMessage);
    });
  });

  // --- likeArticle 테스트 ---
  describe('likeArticle', () => {
    test('게시글 좋아요 메시지를 성공적으로 반환해야 합니다 (상태 코드 200)', async () => {
      const res = await request(app).post('/articles/123/like');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: 'Article liked' });
    });
  });

  // --- unlikeArticle 테스트 ---
  describe('unlikeArticle', () => {
    test('게시글 좋아요 취소를 성공적으로 처리해야 합니다 (상태 코드 204)', async () => {
      const res = await request(app).delete('/articles/123/unlike');

      expect(res.statusCode).toEqual(204);
      expect(res.body).toEqual({});
    });
  });
});