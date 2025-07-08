import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
// 목킹된 Prisma 클라이언트를 가져옵니다.
import prisma from '../../src/models/prisma/prismaClient'; // 실제 경로
// bcrypt 및 jsonwebtoken 모듈을 가져옵니다. (jest.mock이 이 경로를 가로챔)
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// config 모듈을 가져옵니다.
import config from '../../src/config/config'; // 실제 경로
// ApiError 클래스를 가져옵니다.
import ApiError from '../../src/utils/apiError'; // 실제 경로

import {
  signUp,
  signIn,
} from '../../src/controllers/auth.controller';

// --- 외부 모듈 목킹 ---
// Prisma Client 목킹
jest.mock('../../src/models/prisma/prismaClient', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

// bcrypt 목킹
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// jsonwebtoken 목킹
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

// config 목킹
jest.mock('../../src/config/config', () => ({
  jwtSecret: 'test_jwt_secret', // 테스트용 시크릿 키
  jwtExpiration: '1h',          // 테스트용 만료 시간
}));

// `catchAsync` 유틸리티 목킹 (실제 비동기 로직 대신 단순화)
jest.mock('../../src/utils/catchAsync', () => (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  // `ApiError`가 던져질 때 `next`로 잘 전달되도록 처리
  try {
    return Promise.resolve(fn(req, res, next)).catch((err) => {
      // ApiError 인스턴스인 경우 statusCode를 설정하여 전달
      if (err instanceof ApiError) {
        err.statusCode = err.statusCode || 500;
      }
      next(err);
    });
  } catch (error) {
    next(error);
  }
});

// --- Express 애플리케이션 설정 ---
const app = express();
app.use(express.json());

// 테스트용 라우터 설정
app.post('/auth/signup', signUp);
app.post('/auth/signin', signIn);

// 에러 핸들링 미들웨어 (테스트 시 에러를 잡아내기 위함)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.statusCode || 500).send({ message: err.message || 'Internal Server Error' });
});


describe('User Controller', () => {
  let mockUser: any;
  const testPassword = 'testpassword123';
  const testHashedPassword = 'hashedtestpassword';
  const testAccessToken = 'mockAccessToken';

  beforeEach(() => {
    // 각 테스트 전에 모든 목킹된 함수들을 초기화합니다.
    jest.clearAllMocks();
    mockUser = {
      id: 1,
      email: 'test@example.com',
      password: testHashedPassword, // 목킹된 유저는 이미 해시된 비밀번호를 가지고 있다고 가정
      name: 'Test User',
    };

    // 공통적으로 사용될 목킹 값 설정 (필요에 따라 각 테스트에서 오버라이드)
    (bcrypt.hash as jest.Mock).mockResolvedValue(testHashedPassword);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true); // 기본적으로 비밀번호 일치
    (jwt.sign as jest.Mock).mockReturnValue(testAccessToken);
  });

  // --- signUp 테스트 ---
  describe('signUp', () => {
    test('새로운 사용자를 성공적으로 등록해야 합니다 (상태 코드 201)', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null); // 이메일 중복 없음
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/auth/signup')
        .send({ email: mockUser.email, password: testPassword, name: mockUser.name });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(mockUser); // 비밀번호는 이미 해시된 형태로 반환된다고 가정
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: mockUser.email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(testPassword, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: mockUser.email,
          password: testHashedPassword,
          name: mockUser.name,
        },
      });
    });

    test('이메일이 이미 존재할 경우 400 에러를 반환해야 합니다', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser); // 이메일 중복

      const res = await request(app)
        .post('/auth/signup')
        .send({ email: mockUser.email, password: testPassword, name: mockUser.name });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Email already taken');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: mockUser.email } });
      expect(bcrypt.hash).not.toHaveBeenCalled(); // 중복이라 해싱이 일어나지 않음
      expect(prisma.user.create).not.toHaveBeenCalled(); // 중복이라 생성이 일어나지 않음
    });

    test('비밀번호 해싱 실패 시 에러를 반환해야 합니다', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      const errorMessage = 'Hashing failed';
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const res = await request(app)
        .post('/auth/signup')
        .send({ email: mockUser.email, password: testPassword, name: mockUser.name });

      expect(res.statusCode).toEqual(500); // catchAsync가 에러를 잡아서 500으로 반환
      expect(res.body.message).toEqual(errorMessage);
    });

    test('사용자 생성 실패 시 에러를 반환해야 합니다', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      const errorMessage = 'User creation failed';
      (prisma.user.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const res = await request(app)
        .post('/auth/signup')
        .send({ email: mockUser.email, password: testPassword, name: mockUser.name });

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual(errorMessage);
    });
  });

  // --- signIn 테스트 ---
  describe('signIn', () => {
    test('유효한 자격 증명으로 성공적으로 로그인해야 합니다 (상태 코드 200)', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(testAccessToken);

      const res = await request(app)
        .post('/auth/signin')
        .send({ email: mockUser.email, password: testPassword });

      expect(res.statusCode).toEqual(200);
      expect(res.body.accessToken).toEqual(testAccessToken);
      expect(res.body.user).toEqual(mockUser); // user 객체도 함께 반환
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: mockUser.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(testPassword, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.id },
        config.jwtSecret,
        { expiresIn: config.jwtExpiration }
      );
    });

    test('존재하지 않는 이메일일 경우 401 에러를 반환해야 합니다', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null); // 사용자 없음

      const res = await request(app)
        .post('/auth/signin')
        .send({ email: 'nonexistent@example.com', password: testPassword });

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual('Incorrect email or password');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
      expect(bcrypt.compare).not.toHaveBeenCalled(); // 사용자 없으니 비교 안함
      expect(jwt.sign).not.toHaveBeenCalled(); // 사용자 없으니 토큰 생성 안함
    });

    test('비밀번호가 일치하지 않을 경우 401 에러를 반환해야 합니다', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // 비밀번호 불일치

      const res = await request(app)
        .post('/auth/signin')
        .send({ email: mockUser.email, password: 'wrongpassword' });

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual('Incorrect email or password');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: mockUser.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', mockUser.password);
      expect(jwt.sign).not.toHaveBeenCalled(); // 비밀번호 불일치라 토큰 생성 안함
    });

    test('토큰 생성 실패 시 에러를 반환해야 합니다', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const errorMessage = 'Token creation failed';
      (jwt.sign as jest.Mock).mockImplementation(() => { throw new Error(errorMessage); }); // 토큰 생성 중 에러 발생

      const res = await request(app)
        .post('/auth/signin')
        .send({ email: mockUser.email, password: testPassword });

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual(errorMessage);
    });
  });
});