import commentRepository from "../repositories/commentRepository";
import { NotFoundError } from "../types/errors";

// commentRepository 모킹
jest.mock("../repositories/commentRepository");
const mockedcommentRepository = commentRepository as jest.Mocked<
  typeof commentRepository
>;

describe("commentService", () => {
  // 각 테스트 전에 모든 모킹을 초기화
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    test("리뷰 생성이 성공적으로 완료되어야 한다", async () => {
      // Setup
      const commentData = {
        content: "Great Product!",
        productId: 1,
        authorId: 1,
      };

      const expectedcomment = {
        id: "",
        content: "Great Product!",
        productId: 1,
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedcommentRepository.save.mockResolvedValue(expectedcomment);

      // Exercise - 서비스 로직을 직접 실행
      const result = await commentRepository.save("articles", commentData);

      // Assertion
      expect(mockedcommentRepository.save).toHaveBeenCalledWith(commentData);
      expect(mockedcommentRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedcomment);
    });

    test("데이터베이스 에러를 적절히 처리해야 한다", async () => {
      // Setup
      const commentData = {
        title: "Great Product!",
        description: "This product is amazing",
        rating: 5,
        productId: 1,
        authorId: 1,
      };

      const error = new Error("Database connection failed");
      mockedcommentRepository.save.mockRejectedValue(error);

      // Exercise & Assertion
      try {
        await commentRepository.save(commentData);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("Database connection failed");
      }
    });
  });

  describe("getById", () => {
    test("리뷰 조회가 성공적으로 완료되어야 한다", async () => {
      // Setup
      const commentId = 1;
      const expectedcomment = {
        id: 1,
        title: "Great Product!",
        description: "This product is amazing",
        rating: 5,
        productId: 1,
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedcommentRepository.getById.mockResolvedValue(expectedcomment);

      // Exercise - 서비스 로직을 직접 실행
      const result = await commentRepository.getById(commentId);

      // Assertion
      expect(mockedcommentRepository.getById).toHaveBeenCalledWith(commentId);
      expect(mockedcommentRepository.getById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedcomment);
    });

    test("리뷰가 존재하지 않는 경우 null을 반환해야 한다", async () => {
      // Setup
      const commentId = 999;
      mockedcommentRepository.getById.mockResolvedValue(null);

      // Exercise - 서비스 로직을 직접 실행
      const result = await commentRepository.getById(commentId);

      // Assertion
      expect(mockedcommentRepository.getById).toHaveBeenCalledWith(commentId);
      expect(result).toBeNull();
    });

    test("데이터베이스 에러를 적절히 처리해야 한다", async () => {
      // Setup
      const commentId = 1;
      const error = new Error("Database connection failed");
      mockedcommentRepository.getById.mockRejectedValue(error);

      // Exercise & Assertion
      try {
        await commentRepository.getById(commentId);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("Database connection failed");
      }
    });
  });

  describe("update", () => {
    test("리뷰 수정이 성공적으로 완료되어야 한다", async () => {
      // Setup
      const commentId = "";
      const updateData = {
        title: "Updated Title",
        description: "Updated description",
        rating: 4,
      };

      const expectedcomment = {
        id: "",
        title: "Updated Title",
        description: "Updated description",
        rating: 4,
        productId: 1,
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedcommentRepository.edit.mockResolvedValue(expectedcomment);

      // Exercise - 서비스 로직을 직접 실행
      const result = await commentRepository.edit(commentId, updateData);

      // Assertion
      expect(mockedcommentRepository.edit).toHaveBeenCalledWith(
        commentId,
        updateData
      );
      expect(mockedcommentRepository.edit).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedcomment);
    });

    test("부분 업데이트가 성공적으로 완료되어야 한다", async () => {
      // Setup
      const commentId = "";
      const updateData = {
        content: "Updated Review",
        // description과 rating은 업데이트하지 않음
      };

      const expectedcomment = {
        id: "",
        content: "Updated Review",
        productId: 1,
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedcommentRepository.edit.mockResolvedValue(expectedcomment);

      // Exercise - 서비스 로직을 직접 실행
      const result = await commentRepository.edit(commentId, updateData);

      // Assertion
      expect(mockedcommentRepository.edit).toHaveBeenCalledWith(
        commentId,
        updateData
      );
      expect(result).toEqual(expectedcomment);
    });

    describe("deleteById", () => {
      test("리뷰 삭제가 성공적으로 완료되어야 한다", async () => {
        // Setup
        const commentId = "";
        const expectedcomment = {
          id: "",
          content: "Great Product!",
          productId: 1,
          authorId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockedcommentRepository.remove.mockResolvedValue(expectedcomment);

        // Exercise - 서비스 로직을 직접 실행
        const result = await commentRepository.remove(commentId);

        // Assertion
        expect(mockedcommentRepository.remove).toHaveBeenCalledWith(commentId);
        expect(mockedcommentRepository.remove).toHaveBeenCalledTimes(1);
        expect(result).toEqual(expectedcomment);
      });

      test("존재하지 않는 리뷰 삭제 시 에러를 반환해야 한다", async () => {
        // Setup
        const commentId = "";
        const error = new Error("Record to delete does not exist");
        mockedcommentRepository.remove.mockRejectedValue(error);

        // Exercise & Assertion
        try {
          await commentRepository.remove(commentId);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe(
            "Record to delete does not exist"
          );
        }
      });

      test("데이터베이스 에러를 적절히 처리해야 한다", async () => {
        // Setup
        const commentId = 1;
        const error = new Error("Database connection failed");
        mockedcommentRepository.deleteById.mockRejectedValue(error);

        // Exercise & Assertion
        try {
          await commentRepository.deleteById(commentId);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe("Database connection failed");
        }
      });
    });
  });
});
