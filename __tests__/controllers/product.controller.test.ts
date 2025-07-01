import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import * as productService from '../../src/services/product.service'; // 경로 수정
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProductById,
  addToFavorites,
  removeFromFavorites,
} from '../../src/controllers/product.controller'; // 경로 수정

// 목킹된 서비스 함수
jest.mock('../../src/services/product.service');

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
  // `createProduct`에서 `(req.user as any).id`를 사용하므로, 여기에 `user` 객체를 추가합니다.
  (req as any).user = { id: '1' }; // 가상의 사용자 ID를 설정
  next();
};
// --- 인증 미들웨어 목킹 추가 끝 ---


// 테스트용 라우터 설정
// `createProduct` 라우트에 mockAuthMiddleware를 적용합니다.
app.post('/products', mockAuthMiddleware, createProduct); // << 여기에 미들웨어 추가
app.get('/products', getAllProducts);
app.get('/products/:productId', getProductById);
app.put('/products/:productId', updateProduct);
app.delete('/products/:productId', deleteProductById);
app.post('/products/:productId/favorites', addToFavorites);
app.delete('/products/:productId/favorites', removeFromFavorites);

// 에러 핸들링 미들웨어
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => { // _req, _next 사용하지 않으므로 변경
  res.status(err.statusCode || 500).send({ message: err.message || 'Internal Server Error' });
});


describe('Product Controller', () => {
  let mockProduct: any;
  let mockProducts: any[];

  beforeEach(() => {
    jest.clearAllMocks();
    mockProduct = { id: 1, name: 'Test Product', price: 100, userId: '1' }; // userId도 문자열로 통일
    mockProducts = [{ id: 1, name: 'Product A' }, { id: 2, name: 'Product B' }];
  });

  // --- createProduct 테스트 ---
  describe('createProduct', () => {
    test('새로운 제품을 성공적으로 생성해야 합니다 (상태 코드 201)', async () => {
      (productService.createProduct as jest.Mock).mockResolvedValue(mockProduct);

      const res = await request(app)
        .post('/products')
        .send({ name: 'Test Product', price: 100 });
      // .set('req.user.id', '1'); // 이 줄은 이제 필요 없습니다. mockAuthMiddleware가 처리합니다.

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(mockProduct);
      expect(productService.createProduct).toHaveBeenCalledWith({ name: 'Test Product', price: 100 }, '1');
    });

    test('제품 생성 실패 시 에러를 반환해야 합니다', async () => {
      const errorMessage = 'Validation failed';
      (productService.createProduct as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const res = await request(app)
        .post('/products')
        .send({ name: 'Invalid Product' });
      // .set('req.user.id', '1'); // 이 줄도 필요 없습니다.

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual(errorMessage);
    });
  });

  // (이하 나머지 테스트 코드는 동일합니다)
  // --- getAllProducts 테스트 ---
  describe('getAllProducts', () => {
    test('모든 제품을 성공적으로 가져와야 합니다 (상태 코드 200)', async () => {
      (productService.getAllProducts as jest.Mock).mockResolvedValue(mockProducts);

      const res = await request(app).get('/products');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockProducts);
      expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
    });

    test('제품 조회 실패 시 에러를 반환해야 합니다', async () => {
      const errorMessage = 'Database error';
      (productService.getAllProducts as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const res = await request(app).get('/products');

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual(errorMessage);
    });
  });

  // --- getProductById 테스트 ---
  describe('getProductById', () => {
    test('ID로 제품을 성공적으로 가져와야 합니다 (상태 코드 200)', async () => {
      (productService.getProductById as jest.Mock).mockResolvedValue(mockProduct);

      const res = await request(app).get(`/products/${mockProduct.id}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockProduct);
      expect(productService.getProductById).toHaveBeenCalledWith(mockProduct.id);
    });

    test('제품을 찾을 수 없을 때 404를 반환해야 합니다', async () => {
      (productService.getProductById as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/products/999');

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Product not found');
      expect(productService.getProductById).toHaveBeenCalledWith(999);
    });

    test('제품 조회 실패 시 에러를 반환해야 합니다', async () => {
      const errorMessage = 'Invalid ID';
      (productService.getProductById as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const res = await request(app).get('/products/invalidId');

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual(errorMessage);
    });
  });

  // --- updateProduct 테스트 ---
  describe('updateProduct', () => {
    test('제품을 성공적으로 업데이트해야 합니다 (상태 코드 204)', async () => {
      (productService.updateProduct as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app)
        .put(`/products/${mockProduct.id}`)
        .send({ name: 'Updated Product' });

      expect(res.statusCode).toEqual(204);
      expect(productService.updateProduct).toHaveBeenCalledWith(mockProduct.id, { name: 'Updated Product' });
    });

    test('제품 업데이트 실패 시 에러를 반환해야 합니다', async () => {
      const errorMessage = 'Update failed';
      (productService.updateProduct as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const res = await request(app)
        .put('/products/999')
        .send({ name: 'Updated Product' });

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual(errorMessage);
    });
  });

  // --- deleteProductById 테스트 ---
  describe('deleteProductById', () => {
    test('제품을 성공적으로 삭제해야 합니다 (상태 코드 204)', async () => {
      (productService.deleteProductById as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app).delete(`/products/${mockProduct.id}`);

      expect(res.statusCode).toEqual(204);
      expect(productService.deleteProductById).toHaveBeenCalledWith(mockProduct.id);
    });

    test('제품 삭제 실패 시 에러를 반환해야 합니다', async () => {
      const errorMessage = 'Deletion failed';
      (productService.deleteProductById as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const res = await request(app).delete('/products/999');

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual(errorMessage);
    });
  });

  // --- addToFavorites 테스트 ---
  describe('addToFavorites', () => {
    test('즐겨찾기 추가 메시지를 성공적으로 반환해야 합니다 (상태 코드 200)', async () => {
      const res = await request(app).post('/products/123/favorites');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: 'Added to favorites' });
    });
  });

  // --- removeFromFavorites 테스트 ---
  describe('removeFromFavorites', () => {
    test('즐겨찾기 삭제를 성공적으로 처리해야 합니다 (상태 코드 204)', async () => {
      const res = await request(app).delete('/products/123/favorites');

      expect(res.statusCode).toEqual(204);
      expect(res.body).toEqual({});
    });
  });
});