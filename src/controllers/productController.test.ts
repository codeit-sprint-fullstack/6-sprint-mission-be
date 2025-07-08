import { Request, Response, NextFunction } from "express";
import productController from "../controllers/productController";
import productService from "../service/productService";

// productService 모킹
jest.mock("../service/productService");
const mockedProductService = productService as jest.Mocked<
  typeof productService
>;

describe("ProductController - getProducts", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    // Request 객체 모킹
    req = {
      query: {},
      auth: undefined,
    };

    // Response 객체 모킹
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // NextFunction 모킹
    next = jest.fn();

    // Mock 함수 초기화
    jest.clearAllMocks();
  });

  describe("성공 케이스", () => {
    it("기본 파라미터로 상품 목록을 조회해야 한다", async () => {
      // Given
      const mockResult = {
        products: [
          {
            id: "1",
            name: "상품1",
            description: "상품1 설명",
            price: 10000,
            likes: 5,
            tags: ["태그1"],
            userId: "user1",
            createdAt: new Date(),
            updatedAt: new Date(),
            images: ["image1.jpg"],
            author: {
              id: "user1",
              nickname: "작성자1",
              image: null,
            },
            isLiked: false,
          },
          {
            id: "2",
            name: "상품2",
            description: "상품2 설명",
            price: 20000,
            likes: 10,
            tags: ["태그2"],
            userId: "user2",
            createdAt: new Date(),
            updatedAt: new Date(),
            images: ["image2.jpg"],
            author: {
              id: "user2",
              nickname: "작성자2",
              image: null,
            },
            isLiked: false,
          },
        ],
        pagination: {
          total: 2,
          page: 0,
          pageSize: 10,
          totalPages: 1,
        },
        sort: "latest",
      };

      mockedProductService.getProducts.mockResolvedValue(mockResult);

      // When
      await productController.getProducts(
        req as Request,
        res as Response,
        next
      );

      // Then
      expect(mockedProductService.getProducts).toHaveBeenCalledWith({
        page: undefined,
        pageSize: undefined,
        orderBy: undefined,
        keyWord: undefined,
        userId: undefined,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        products: mockResult.products,
        pagination: mockResult.pagination,
        sort: mockResult.sort,
      });
    });

    it("쿼리 파라미터가 포함된 요청을 처리해야 한다", async () => {
      // Given
      req.query = {
        page: "1",
        pageSize: "5",
        orderBy: "likes",
        keyWord: "테스트",
      };

      const mockResult = {
        products: [
          {
            id: "1",
            name: "테스트 상품",
            description: "테스트 상품 설명",
            price: 15000,
            likes: 3,
            tags: ["테스트"],
            userId: "user1",
            createdAt: new Date(),
            updatedAt: new Date(),
            images: ["test.jpg"],
            author: {
              id: "user1",
              nickname: "테스터",
              image: null,
            },
            isLiked: false,
          },
        ],
        pagination: {
          total: 1,
          page: 1,
          pageSize: 5,
          totalPages: 1,
        },
        sort: "likes",
      };

      mockedProductService.getProducts.mockResolvedValue(mockResult);

      // When
      await productController.getProducts(
        req as Request,
        res as Response,
        next
      );

      // Then
      expect(mockedProductService.getProducts).toHaveBeenCalledWith({
        page: "1",
        pageSize: "5",
        orderBy: "likes",
        keyWord: "테스트",
        userId: undefined,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        products: mockResult.products,
        pagination: mockResult.pagination,
        sort: mockResult.sort,
      });
    });

    it("인증된 사용자의 요청을 처리해야 한다", async () => {
      // Given
      req.auth = { userId: "user123" };
      req.query = { page: "0", pageSize: "10" };

      const mockResult = {
        products: [
          {
            id: "1",
            name: "상품1",
            description: "상품1 설명",
            price: 10000,
            likes: 5,
            tags: ["태그1"],
            userId: "user1",
            createdAt: new Date(),
            updatedAt: new Date(),
            images: ["image1.jpg"],
            author: {
              id: "user1",
              nickname: "작성자1",
              image: null,
            },
            isLiked: true,
          },
          {
            id: "2",
            name: "상품2",
            description: "상품2 설명",
            price: 20000,
            likes: 10,
            tags: ["태그2"],
            userId: "user2",
            createdAt: new Date(),
            updatedAt: new Date(),
            images: ["image2.jpg"],
            author: {
              id: "user2",
              nickname: "작성자2",
              image: null,
            },
            isLiked: false,
          },
        ],
        pagination: {
          total: 2,
          page: 0,
          pageSize: 10,
          totalPages: 1,
        },
        sort: "latest",
      };

      mockedProductService.getProducts.mockResolvedValue(mockResult);

      // When
      await productController.getProducts(
        req as Request,
        res as Response,
        next
      );

      // Then
      expect(mockedProductService.getProducts).toHaveBeenCalledWith({
        page: "0",
        pageSize: "10",
        orderBy: undefined,
        keyWord: undefined,
        userId: "user123",
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        products: mockResult.products,
        pagination: mockResult.pagination,
        sort: mockResult.sort,
      });
    });

    it("빈 상품 목록을 반환해야 한다", async () => {
      // Given
      const mockResult = {
        products: [],
        pagination: {
          total: 0,
          page: 0,
          pageSize: 10,
          totalPages: 0,
        },
        sort: "latest",
      };

      mockedProductService.getProducts.mockResolvedValue(mockResult);

      // When
      await productController.getProducts(
        req as Request,
        res as Response,
        next
      );

      // Then
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        products: [],
        pagination: mockResult.pagination,
        sort: mockResult.sort,
      });
    });
  });

  describe("실패 케이스", () => {
    it("서비스에서 에러가 발생하면 next로 에러를 전달해야 한다", async () => {
      // Given
      const mockError = new Error("데이터베이스 연결 실패");
      mockedProductService.getProducts.mockRejectedValue(mockError);

      // When
      await productController.getProducts(
        req as Request,
        res as Response,
        next
      );

      // Then
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("예상치 못한 에러가 발생하면 next로 에러를 전달해야 한다", async () => {
      // Given
      const mockError = new Error("서버 내부 오류");
      mockedProductService.getProducts.mockRejectedValue(mockError);

      // When
      await productController.getProducts(
        req as Request,
        res as Response,
        next
      );

      // Then
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
