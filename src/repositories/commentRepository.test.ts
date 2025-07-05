import prisma from "../config/client.prisma";
import commentRepository from "./commentRepository";

// Prisma 클라이언트 모킹
jest.mock("../config/prisma", () => ({
  comment: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

describe("commentRepository", () => {
  // 각 테스트 전에 모든 모킹을 초기화
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("save", () => {
    test("리뷰 생성이 성공적으로 완료되어야 한다", async () => {
      // Setup
      const commentData = {
        title: "Great Product!",
        description: "This product exceeded my expectations.",
        rating: 5,
        productId: 1,
        authorId: 1,
      };

      const expectedcomment = {
        id: 1,
        title: "Great Product!",
        description: "This product exceeded my expectations.",
        rating: 5,
        productId: 1,
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockedPrisma.comment.create as jest.Mock).mockResolvedValue(
        expectedcomment
      );

      // Exercise
      const result = await commentRepository.save(commentData);

      // Assertion
      expect(mockedPrisma.comment.create).toHaveBeenCalledWith({
        data: {
          title: commentData.title,
          description: commentData.description,
          rating: commentData.rating,
          product: {
            connect: {
              id: commentData.productId,
            },
          },
          author: {
            connect: {
              id: commentData.authorId,
            },
          },
        },
      });
      expect(mockedPrisma.comment.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedcomment);
    });

    test("데이터베이스 에러를 적절히 처리해야 한다", async () => {
      // Setup
      const commentData = {
        title: "Great Product!",
        description: "This product exceeded my expectations.",
        rating: 5,
        productId: 1,
        authorId: 1,
      };

      const error = new Error("Database connection failed");
      (mockedPrisma.comment.create as jest.Mock).mockRejectedValue(error);

      // Exercise & Assertion
      await expect(commentRepository.save(commentData)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("getById", () => {
    test("리뷰 조회가 성공적으로 완료되어야 한다", async () => {
      // Setup
      const commentId = 1;
      const expectedcomment = {
        id: 1,
        title: "Great Product!",
        description: "This product exceeded my expectations.",
        rating: 5,
        productId: 1,
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockedPrisma.comment.findUnique as jest.Mock).mockResolvedValue(
        expectedcomment
      );

      // Exercise
      const result = await commentRepository.getById(commentId);

      // Assertion
      expect(mockedPrisma.comment.findUnique).toHaveBeenCalledWith({
        where: {
          id: commentId,
        },
      });
      expect(mockedPrisma.comment.findUnique).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedcomment);
    });

    test("리뷰가 존재하지 않는 경우 null을 반환해야 한다", async () => {
      // Setup
      const commentId = 999;
      (mockedPrisma.comment.findUnique as jest.Mock).mockResolvedValue(null);

      // Exercise
      const result = await commentRepository.getById(commentId);

      // Assertion
      expect(mockedPrisma.comment.findUnique).toHaveBeenCalledWith({
        where: {
          id: commentId,
        },
      });
      expect(result).toBeNull();
    });

    test("데이터베이스 에러를 적절히 처리해야 한다", async () => {
      // Setup
      const commentId = 1;
      const error = new Error("Database connection failed");
      (mockedPrisma.comment.findUnique as jest.Mock).mockRejectedValue(error);

      // Exercise & Assertion
      await expect(commentRepository.getById(commentId)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("getAll", () => {
    test("모든 리뷰 조회가 성공적으로 완료되어야 한다", async () => {
      // Setup
      const expectedcomments = [
        {
          id: 1,
          title: "Great Product!",
          description: "This product exceeded my expectations.",
          rating: 5,
          productId: 1,
          authorId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: "Good Product",
          description: "This product is good but could be better.",
          rating: 4,
          productId: 1,
          authorId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockedPrisma.comment.findMany as jest.Mock).mockResolvedValue(
        expectedcomments
      );

      // Exercise
      const result = await commentRepository.getAll();

      // Assertion
      expect(mockedPrisma.comment.findMany).toHaveBeenCalledWith();
      expect(mockedPrisma.comment.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedcomments);
    });

    test("리뷰가 없는 경우 빈 배열을 반환해야 한다", async () => {
      // Setup
      (mockedPrisma.comment.findMany as jest.Mock).mockResolvedValue([]);

      // Exercise
      const result = await commentRepository.getAll();

      // Assertion
      expect(mockedPrisma.comment.findMany).toHaveBeenCalledWith();
      expect(result).toEqual([]);
    });

    test("데이터베이스 에러를 적절히 처리해야 한다", async () => {
      // Setup
      const error = new Error("Database connection failed");
      (mockedPrisma.comment.findMany as jest.Mock).mockRejectedValue(error);

      // Exercise & Assertion
      await expect(commentRepository.getAll()).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("update", () => {
    test("리뷰 업데이트가 성공적으로 완료되어야 한다", async () => {
      // Setup
      const commentId = 1;
      const updateData = {
        title: "Updated Title",
        description: "Updated description",
        rating: 4,
      };

      const expectedcomment = {
        id: 1,
        title: "Updated Title",
        description: "Updated description",
        rating: 4,
        productId: 1,
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockedPrisma.comment.update as jest.Mock).mockResolvedValue(
        expectedcomment
      );

      // Exercise
      const result = await commentRepository.update(commentId, updateData);

      // Assertion
      expect(mockedPrisma.comment.update).toHaveBeenCalledWith({
        where: {
          id: commentId,
        },
        data: {
          title: updateData.title,
          description: updateData.description,
          rating: updateData.rating,
        },
      });
      expect(mockedPrisma.comment.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedcomment);
    });

    test("부분 업데이트가 성공적으로 완료되어야 한다", async () => {
      // Setup
      const commentId = 1;
      const updateData = {
        title: "Updated Title",
      };

      const expectedcomment = {
        id: 1,
        title: "Updated Title",
        description: "Original description",
        rating: 5,
        productId: 1,
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockedPrisma.comment.update as jest.Mock).mockResolvedValue(
        expectedcomment
      );

      // Exercise
      const result = await commentRepository.update(commentId, updateData);

      // Assertion
      expect(mockedPrisma.comment.update).toHaveBeenCalledWith({
        where: {
          id: commentId,
        },
        data: {
          title: updateData.title,
          description: undefined,
          rating: undefined,
        },
      });
      expect(result).toEqual(expectedcomment);
    });

    test("데이터베이스 에러를 적절히 처리해야 한다", async () => {
      // Setup
      const commentId = 1;
      const updateData = {
        title: "Updated Title",
        description: "Updated description",
        rating: 4,
      };

      const error = new Error("Database connection failed");
      (mockedPrisma.comment.update as jest.Mock).mockRejectedValue(error);

      // Exercise & Assertion
      await expect(
        commentRepository.update(commentId, updateData)
      ).rejects.toThrow("Database connection failed");
    });
  });

  describe("deleteById", () => {
    test("리뷰 삭제가 성공적으로 완료되어야 한다", async () => {
      // Setup
      const commentId = "";
      const expectedcomment = {
        id: 1,
        title: "Great Product!",
        description: "This product exceeded my expectations.",
        rating: 5,
        productId: 1,
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockedPrisma.comment.delete as jest.Mock).mockResolvedValue(
        expectedcomment
      );

      // Exercise
      const result = await commentRepository.deleteById(commentId);

      // Assertion
      expect(mockedPrisma.comment.delete).toHaveBeenCalledWith({
        where: {
          id: commentId,
        },
      });
      expect(mockedPrisma.comment.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedcomment);
    });

    test("데이터베이스 에러를 적절히 처리해야 한다", async () => {
      // Setup
      const commentId = "";
      const error = new Error("Database connection failed");
      (mockedPrisma.comment.delete as jest.Mock).mockRejectedValue(error);

      // Exercise & Assertion
      await expect(commentRepository.remove(commentId)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });
});
