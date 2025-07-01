import request from 'supertest'; // rest api 테스트를 위한 supertest 라이브러리
// jest와 supertest를 사용하여 Express 앱의 라우트와 컨트롤러
// 함수를 테스트합니다.
// 이 파일은 사용자 관련 컨트롤러 함수들을 테스트하기 위한 것입니다.
// 각 컨트롤러 함수에 대한 테스트 케이스를 작성하여
// 올바른 동작을 검증합니다.
// 테스트는 실제 데이터베이스에 의존하지 않고 Mocking된 Prisma 클라이언트를 사용하여
// 격리된 환경에서 실행됩니다.      
import express, { Request, Response, NextFunction } from 'express';
import {
  getMe,
  updateMe,
  updatePassword,
  getMyProducts,
  getMyFavorites,
} from '../../src/controllers/user.controller';
import prismaClient from '../../src/models/prisma/prismaClient'; // Prisma 클라이언트 임포트
import catchAsync from '../../src/utils/catchAsync'; // catchAsync 임포트 (필요 시)

// Express 앱 Mocking: 실제 앱 라우팅을 테스트하기 위한 최소한의 앱 구성
// 미들웨어와 라우트를 추가하여 컨트롤러 함수들을 테스트할 수 있도록 합니다.
const app = express();
app.use(express.json()); // body-parser 미들웨어
app.use((req: Request, res: Response, next: NextFunction) => {
  // RequestWithUser 인터페이스를 모킹하기 위한 미들웨어
  // 실제 미들웨어(예: JWT 인증 미들웨어)에서 req.user를 설정하는 상황을 시뮬레이션합니다.
  (req as any).user = {
    id: 1,
    nickname: 'testuser',
    email: 'test@example.com',
  };
  next();
});

// 컨트롤러 함수들을 테스트하기 위한 라우트 설정
app.get('/me', getMe);
app.patch('/me', updateMe);
app.patch('/me/password', updatePassword);
app.get('/me/products', getMyProducts);
app.get('/me/favorites', getMyFavorites);

// Prisma 클라이언트 Mocking
// 실제 데이터베이스 호출을 방지하고 테스트를 격리하기 위해 Prisma 클라이언트를 Mocking합니다.
// 이렇게 하면 테스트 시 데이터베이스에 의존하지 않게 됩니다.
jest.mock('../../src/models/prisma/prismaClient', () => ({
  user: {
    update: jest.fn(),
    findUnique: jest.fn(), // 필요 시 추가
  },
  product: {
    findMany: jest.fn(),
  },
  // 다른 모델들도 필요에 따라 추가 Mocking
}));

// 각 테스트 전에 Mocking된 Prisma 클라이언트의 Mock 데이터를 초기화합니다.
beforeEach(() => {
  jest.clearAllMocks();
});

describe('User Controller', () => {
  // --- getMe 테스트 ---
  describe('GET /me', () => {
    it('사용자 정보를 성공적으로 반환해야 합니다.', async () => {
      const res = await request(app).get('/me');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        id: 1,
        nickname: 'testuser',
        email: 'test@example.com',
      });
    });
  });

  // --- updateMe 테스트 ---
  describe('PATCH /me', () => {
    it('사용자 정보를 성공적으로 업데이트해야 합니다.', async () => {
      // Prisma update 메소드가 반환할 가상의 데이터 설정
      (prismaClient.user.update as jest.Mock).mockResolvedValueOnce({
        id: 1,
        nickname: 'updateduser',
        email: 'updated@example.com',
      });

      const res = await request(app)
        .patch('/me')
        .send({ nickname: 'updateduser', email: 'updated@example.com' });

      expect(res.statusCode).toEqual(200);
      expect(prismaClient.user.update).toHaveBeenCalledTimes(1); // update 메소드가 한 번 호출되었는지 확인
      expect(prismaClient.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { nickname: 'updateduser', email: 'updated@example.com' },
      });
      expect(res.body).toEqual({
        id: 1,
        nickname: 'updateduser',
        email: 'updated@example.com',
      });
    });

    it('업데이트할 데이터가 없어도 성공적으로 응답해야 합니다.', async () => {
      (prismaClient.user.update as jest.Mock).mockResolvedValueOnce({
        id: 1,
        nickname: 'testuser', // 변경 사항 없음
        email: 'test@example.com',
      });

      const res = await request(app)
        .patch('/me')
        .send({}); // 빈 객체 전송

      expect(res.statusCode).toEqual(200);
      expect(prismaClient.user.update).toHaveBeenCalledTimes(1);
      expect(prismaClient.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {}, // 빈 데이터 객체로 호출되었는지 확인
      });
    });

    // TODO: 유효성 검사 실패 시 (예: 이메일 형식 오류) 테스트 케이스 추가
    // TODO: 사용자 ID가 없는 경우 (미들웨어 에러 등) 테스트 케이스 추가 (catchAsync 동작 확인)
  });

  // --- updatePassword 테스트 ---
  describe('PATCH /me/password', () => {
    it('비밀번호 업데이트 메시지를 성공적으로 반환해야 합니다.', async () => {
      const res = await request(app)
        .patch('/me/password')
        .send({ currentPassword: 'oldpassword', newPassword: 'newpassword' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: 'Password updated' });
    });

    // TODO: 실제 비밀번호 업데이트 로직이 있다면 해당 로직을 Mocking하고 테스트 추가
    // 예: 비밀번호 해싱, 이전 비밀번호 확인 로직 등
  });

  // --- getMyProducts 테스트 ---
  describe('GET /me/products', () => {
    it('사용자가 등록한 상품 목록을 성공적으로 반환해야 합니다.', async () => {
      const mockProducts = [
        { id: 101, name: 'Product A', userId: 1 },
        { id: 102, name: 'Product B', userId: 1 },
      ];
      // Prisma findMany 메소드가 반환할 가상의 데이터 설정
      (prismaClient.product.findMany as jest.Mock).mockResolvedValueOnce(
        mockProducts,
      );

      const res = await request(app).get('/me/products');

      expect(res.statusCode).toEqual(200);
      expect(prismaClient.product.findMany).toHaveBeenCalledTimes(1);
      expect(prismaClient.product.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
      expect(res.body).toEqual(mockProducts);
    });

    it('등록된 상품이 없을 경우 빈 배열을 반환해야 합니다.', async () => {
      (prismaClient.product.findMany as jest.Mock).mockResolvedValueOnce([]); // 빈 배열 반환

      const res = await request(app).get('/me/products');

      expect(res.statusCode).toEqual(200);
      expect(prismaClient.product.findMany).toHaveBeenCalledTimes(1);
      expect(res.body).toEqual([]);
    });
  });

  // --- getMyFavorites 테스트 ---
  describe('GET /me/favorites', () => {
    it('사용자 즐겨찾기 메시지를 성공적으로 반환해야 합니다.', async () => {
      const res = await request(app).get('/me/favorites');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: 'User favorites' });
    });

    // TODO: 실제 즐겨찾기 조회 로직이 있다면 해당 로직을 Mocking하고 테스트 추가
  });
});