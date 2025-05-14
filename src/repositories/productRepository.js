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

  findAllProducts: async () => {
    return prisma.product.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
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