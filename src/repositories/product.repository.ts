import { PrismaClient, Product, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const productRepository = {
  createProduct: async (
    userId: string,
    name: string,
    description: string,
    price: number,
    tags: string[],
    images: string[]
  ): Promise<Product> => {
    return prisma.product.create({
      data: {
        userId,
        name,
        description,
        price,
        tags,
        images,
      },
    });
  },

  findAllProducts: async (
    sort: string,
    search: string | undefined,
    skip: number,
    limit: number
  ): Promise<Product[]> => {
    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
            { tags: { hasSome: [search] } },
          ],
        }
      : undefined;

    const orderBy: Prisma.ProductOrderByWithRelationInput | undefined =
      sort === "price_asc"
        ? { price: "asc" }
        : sort === "price_desc"
        ? { price: "desc" }
        : sort === "recent"
        ? { createdAt: "desc" }
        : undefined;

    return prisma.product.findMany({
      where,
      ...(orderBy && { orderBy }),
      skip,
      take: limit,
    });
  },

  findProductById: async (id: number): Promise<Product | null> => {
    return prisma.product.findUnique({
      where: { id },
    });
  },

  updateProduct: async (
    id: number,
    name: string,
    description: string,
    price: number,
    tags: string[],
    images: string[]
  ): Promise<Product> => {
    return prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        tags,
        images,
      },
    });
  },

  deleteProduct: async (id: number): Promise<Product> => {
    return prisma.product.delete({
      where: { id },
    });
  },
};

export default productRepository;
