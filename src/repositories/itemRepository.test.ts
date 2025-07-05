import { JsonKeyToVariableMap } from "aws-sdk/clients/frauddetector";
import prisma from "../config/client.prisma";
import itemRepository from "./itemRepository";

jest.mock("../config/client.prisma", () => ({
  item: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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
        id: "randomId",
        name: "Test item",
        price: 10000,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const expectedFavorite = { id: expecteditem.id };

      (mockedPrisma.item.findUnique as jest.Mock).mockResolvedValue(
        expecteditem
      );

      (mockedPrisma.item.findFirst as jest.Mock).mockResolvedValue(
        expectedFavorite
      );

      // Exercise
      const result = await itemRepository.getById(itemId, userId);

      // Assertion
      expect(mockedPrisma.item.findUnique).toHaveBeenCalledWith({
        where: { id: itemId },
        include: {
          comments: {
            include: { user: true },
          },
        },
      });

      expect(mockedPrisma.item.findFirst).toHaveBeenCalledWith({
        where: {
          id: itemId,
          favoriteUsers: {
            some: { id: userId },
          },
        },
      });
      expect(mockedPrisma.item.findUnique).toHaveBeenCalledTimes(1);
      expect(mockedPrisma.item.findFirst).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ...expecteditem, isFavorite: expectedFavorite });
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
        where: { id: itemId },
        include: {
          comments: {
            include: { user: true },
          },
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
        id: "randomId",
        name: "New item",
        description: "새로운 아이템",
        price: 15000,
        tags: ["전자"],
        images: ["example.com"],
        user: {
          connect: {
            id: "cmccy8dz000003ayqquvh7a2b",
          },
        },
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
          user: { connect: { id: itemData.userId } },
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
        id: "randomId",
        name: "Zero item",
        description: "새로운 아이템",
        price: 15000,
        tags: ["전자"],
        images: ["example.com"],
        user: {
          connect: {
            id: "cmccy8dz000003ayqquvh7a2b",
          },
        },
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
          user: { connect: { id: itemData.userId } },
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
        id: "randomId",
        name: "Expensive item",
        description: "새로운 아이템",
        price: 150000000,
        tags: ["전자"],
        images: ["example.com"],
        user: {
          connect: {
            id: "cmccy8dz000003ayqquvh7a2b",
          },
        },
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
          user: { connect: { id: itemData.userId } },
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
  describe("edit", () => {
    test("상품 수정이 성공적으로 완료되어야 한다", async () => {
      const itemId = "cmccy9kiy00013ayqlkln58br";
      const updateData = {
        name: "Updated item",
        description: "수정된 설명",
        price: 20000,
        tags: ["전자", "할인"],
        images: ["updated.com"],
      };
      const updatedItem = {
        id: itemId,
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockedPrisma.item.update as jest.Mock).mockResolvedValue(updatedItem);

      const result = await itemRepository.edit(itemId, updateData);

      expect(mockedPrisma.item.update).toHaveBeenCalledWith({
        where: { id: itemId },
        data: updateData,
      });

      expect(mockedPrisma.item.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedItem);
    });
  });
  describe("remove", () => {
    test("상품 삭제가 성공적으로 완료되어야 한다", async () => {
      const itemId = "cmccy9kiy00013ayqlkln58br";
      const deletedItem = {
        id: itemId,
        name: "Deleted item",
        price: 10_000,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockedPrisma.item.delete as jest.Mock).mockResolvedValue(deletedItem);

      const result = await itemRepository.remove(itemId);

      expect(mockedPrisma.item.delete).toHaveBeenCalledWith({
        where: { id: itemId },
      });
      expect(mockedPrisma.item.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual(deletedItem);
    });
  });
});
