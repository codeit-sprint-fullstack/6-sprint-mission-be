import { Product } from "@prisma/client";
import productService from "./product.service";
import productRepository from "../repositories/product.repository";
import { BadRequestError } from "../types/exceptions";

jest.mock("../repositories/product.repository");

describe("ProductService 유닛 테스트", () => {
  const mockProduct = {
    id: 1,
    name: "테스트 상품",
    description: "테스트 설명",
    price: 10000,
    tags: ["전자제품"],
    images: ["img1.jpg"],
    ownerId: "user1",
    likeCount: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Product;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProducts", () => {
    test("상품 목록을 반환해야 한다", async () => {
      const mockData = { totalCount: 1, products: [mockProduct] };
      (productRepository.findAll as jest.Mock).mockResolvedValue(mockData);

      const result = await productService.getProducts({
        page: 1,
        pageSize: 10,
        orderBy: "recent",
      });

      expect(productRepository.findAll).toHaveBeenCalled();
      expect(result.products.length).toBe(1);
      expect(result.products[0].name).toBe("테스트 상품");
    });
  });

  const mockLike = null;

  describe("getProduct", () => {
    test("id로 상품을 조회해야 한다", async () => {
      (productRepository.findById as jest.Mock).mockResolvedValue([
        mockLike,
        mockProduct,
      ]);

      const [_, product] = await productService.getProduct(1, "user1");

      expect(productRepository.findById).toHaveBeenCalledWith(1, "user1");
      expect(product?.id).toBe(1);
    });
  });

  describe("createProduct", () => {
    test("상품을 생성해야 한다", async () => {
      (productRepository.save as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productService.createProduct(mockProduct, {} as any);

      expect(productRepository.save).toHaveBeenCalled();
      expect(result.name).toBe("테스트 상품");
    });
  });

  describe("updateProduct", () => {
    test("상품을 수정해야 한다", async () => {
      const updated = { ...mockProduct, name: "수정된 상품" };
      (productRepository.findById as jest.Mock).mockResolvedValue(mockProduct);
      (productRepository.update as jest.Mock).mockResolvedValue(updated);

      const result = await productService.updateProduct(1, {
        name: "수정된 상품",
      } as any);

      expect(productRepository.update).toHaveBeenCalled();
      expect(result.name).toBe("수정된 상품");
    });
  });

  describe("deleteProduct", () => {
    test("상품을 삭제해야 한다", async () => {
      (productRepository.findById as jest.Mock).mockResolvedValue(mockProduct);
      (productRepository.remove as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productService.deleteProduct(1);

      expect(productRepository.remove).toHaveBeenCalledWith(1);
      expect(result.id).toBe(1);
    });
  });

  describe("likeProduct", () => {
    test("상품을 찜할 수 있어야 한다", async () => {
      (productRepository.findLike as jest.Mock).mockResolvedValue(null);
      (productRepository.createLike as jest.Mock).mockResolvedValue({
        id: "like1",
      });

      const result = await productService.likeProduct(1, "user1");

      expect(productRepository.findLike).toHaveBeenCalledWith(1, "user1");
      expect(productRepository.createLike).toHaveBeenCalledWith(1, "user1");
      expect(result).toEqual({ id: "like1" });
    });

    test("이미 찜한 상품이면 예외를 발생시켜야 한다", async () => {
      (productRepository.findLike as jest.Mock).mockResolvedValue({
        id: "like1",
      });

      await expect(productService.likeProduct(1, "user1")).rejects.toThrow(
        new BadRequestError("이미 찜한 상품입니다.")
      );

      expect(productRepository.createLike).not.toHaveBeenCalled();
    });
  });

  describe("unlikeProduct", () => {
    test("찜한 상품을 취소할 수 있어야 한다", async () => {
      (productRepository.findLike as jest.Mock).mockResolvedValue({
        id: "like1",
      });
      (productRepository.deleteLike as jest.Mock).mockResolvedValue({
        id: "like1",
      });

      const result = await productService.unlikeProduct(1, "user1");

      expect(productRepository.findLike).toHaveBeenCalledWith(1, "user1");
      expect(productRepository.deleteLike).toHaveBeenCalledWith(1, "user1");
      expect(result).toEqual({ id: "like1" });
    });

    test("찜하지 않은 상품이면 예외를 발생시켜야 한다", async () => {
      (productRepository.findLike as jest.Mock).mockResolvedValue(null);

      await expect(productService.unlikeProduct(1, "user1")).rejects.toThrow(
        new BadRequestError("찜하지 않은 상품입니다.")
      );

      expect(productRepository.deleteLike).not.toHaveBeenCalled();
    });
  });
});
