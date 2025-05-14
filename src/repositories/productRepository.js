import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const productRepository = {
  createProduct: async (userId, name, description, price, tags , images ) => {
    return prisma.product.create({
      data: {
        userId,
        name,
        description,
        price: parseInt(price),
        tags,
        images,
      },
    });
  },

  findAllProducts: async (sort, search, skip, limit) => {
    const orderBy = {};
    if (sort === 'favorite') {
      orderBy._count = { likes: 'desc' }; 
    } else {
      orderBy.createdAt = 'desc'; 
    }

    // NaN 방지 처리
    if (isNaN(skip) || skip < 0) skip = 0;
    if (isNaN(limit) || limit < 1) limit = 10;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { user: { nickname: { contains: search } } },
        { tags: { has: search } },
      ];
    }

    return prisma.product.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
        likes: true,
        comments: true,
      },
      orderBy,
      skip,
      take: limit,
    });
  },

  findProductById: async (id) => {
    return prisma.product.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
        likes: true,
        comments: {
          include: {
            writer: {
              select: {
                id: true,
                nickname: true,
              },
            },
          },
        },
      },
    });
  },

  updateProduct: async (id, name, description, price, tags, images) => {
    return prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parseInt(price),
        tags,
        images,
        updatedAt: new Date(),
      },
    });
  },

  deleteProduct: async (id) => {
    return prisma.product.delete({
      where: { id },
    });
  },
};

export default productRepository;