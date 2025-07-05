import prisma from "../config/client.prisma";
import itemRepository from "./itemRepository";

jest.mock("../config/client.prisma", () => ({
  item: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

describe.only("ItemRepository", () => {
  // 각 테스트 전에 모든 모킹을 초기화
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getById", () => {
    test("상품 조회가 성공적으로 완료되어야 한다", async () => {
      // Setup
      const itemId = "cmccy9kiy00013ayqlkln58br";
      const userId = "cmccy8dz000003ayqquvh7a2b";
      const expecteditem = {
        id: 1,
        name: "Test item",
        price: 10000,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockedPrisma.item.findUnique as jest.Mock).mockResolvedValue(
        expecteditem
      );

      // Exercise
      const result = await itemRepository.getById(itemId, userId);

      // Assertion
      expect(mockedPrisma.item.findUnique).toHaveBeenCalledWith({
        where: {
          id: itemId,
        },
      });
      expect(mockedPrisma.item.findUnique).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expecteditem);
    });

    test("상품이 존재하지 않는 경우 null을 반환해야 한다", async () => {
      // Setup
      const itemId = "none";
      const userId = "cmccy8dz000003ayqquvh7a2b";
      (mockedPrisma.item.findUnique as jest.Mock).mockResolvedValue(null);

      // Exercise
      const result = await itemRepository.getById(itemId, userId);

      // Assertion
      expect(mockedPrisma.item.findUnique).toHaveBeenCalledWith({
        where: {
          id: itemId,
        },
      });
      expect(result).toBeNull();
    });

    test("데이터베이스 에러를 적절히 처리해야 한다", async () => {
      // Setup
      const itemId = "cmccy9kiy00013ayqlkln58br";
      const userId = "cmccy8dz000003ayqquvh7a2b";
      const error = new Error("Database connection failed");
      (mockedPrisma.item.findUnique as jest.Mock).mockRejectedValue(error);

      // Exercise & Assertion
      await expect(itemRepository.getById(itemId, userId)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("save", () => {
    test("상품 생성이 성공적으로 완료되어야 한다", async () => {
      // Setup
      const itemData = {
        name: "New item",
        description: "새로운 아이템",
        price: 15000,
        tags: ["전자"],
        images: ["example.com"],
        userId: "cmccy8dz000003ayqquvh7a2b",
      };

      const expectedItem = {
        id: expect.any(String),
        name: "New item",
        description: "새로운 아이템",
        price: 15000,
        tags: ["전자"],
        images: ["example.com"],
        userId: "cmccy8dz000003ayqquvh7a2b",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockedPrisma.item.create as jest.Mock).mockResolvedValue(expectedItem);

      // Exercise
      const result = await itemRepository.save(itemData);

      // Assertion
      expect(mockedPrisma.item.create).toHaveBeenCalledWith({
        data: {
          name: itemData.name,
          description: itemData.description,
          price: itemData.price,
          tags: itemData.tags,
          images: itemData.images,
          userId: itemData.userId,
        },
      });
      expect(mockedPrisma.item.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedItem);
    });

    test("가격이 0인 상품도 생성할 수 있어야 한다", async () => {
      // Setup
      const itemData = {
        name: "Zero item",
        description: "새로운 아이템",
        price: 0,
        tags: ["전자"],
        images: ["example.com"],
        userId: "cmccy8dz000003ayqquvh7a2b",
      };

      const expecteditem = {
        id: expect.any(String),
        name: "Zero item",
        description: "새로운 아이템",
        price: 15000,
        tags: ["전자"],
        images: ["example.com"],
        userId: "cmccy8dz000003ayqquvh7a2b",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockedPrisma.item.create as jest.Mock).mockResolvedValue(expecteditem);

      // Exercise
      const result = await itemRepository.save(itemData);

      // Assertion
      expect(mockedPrisma.item.create).toHaveBeenCalledWith({
        data: {
          name: itemData.name,
          description: itemData.description,
          price: itemData.price,
          tags: itemData.tags,
          images: itemData.images,
          userId: itemData.userId,
        },
      });
      expect(result).toEqual(expecteditem);
    });

    test("고가의 상품도 생성할 수 있어야 한다", async () => {
      // Setup
      const itemData = {
        name: "Expensive item",
        description: "새로운 아이템",
        price: 150000000,
        tags: ["전자"],
        images: ["example.com"],
        userId: "cmccy8dz000003ayqquvh7a2b",
      };

      const expectedItem = {
        id: 1,
        name: "Expensive item",
        description: "새로운 아이템",
        price: 150000000,
        tags: ["전자"],
        images: ["example.com"],
        userId: "cmccy8dz000003ayqquvh7a2b",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockedPrisma.item.create as jest.Mock).mockResolvedValue(expectedItem);

      // Exercise
      const result = await itemRepository.save(itemData);

      // Assertion
      expect(mockedPrisma.item.create).toHaveBeenCalledWith({
        data: {
          name: itemData.name,
          description: itemData.description,
          price: itemData.price,
          tags: itemData.tags,
          images: itemData.images,
          userId: itemData.userId,
        },
      });
      expect(result).toEqual(expectedItem);
    });

    test("데이터베이스 에러를 적절히 처리해야 한다", async () => {
      // Setup
      const itemData = {
        name: "Test item",
        description: "새로운 아이템",
        price: 15000,
        tags: ["전자"],
        images: ["example.com"],
        userId: "cmccy8dz000003ayqquvh7a2b",
      };

      const error = new Error("Database connection failed");
      (mockedPrisma.item.create as jest.Mock).mockRejectedValue(error);

      // Exercise & Assertion
      await expect(itemRepository.save(itemData)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });
});
