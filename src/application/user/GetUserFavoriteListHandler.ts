import { prismaClient } from '../../infra/prismaClient.js';
import { NotFoundException } from '../../exceptions/NotFoundException.js';
import { ExceptionMessage } from '../../constant/ExceptionMessage.js';
import { Product } from '../../domain/Product.js';

interface IRequester {
  userId: number;
}

interface IGetUserFavoriteListDTO {
  page: number;
  pageSize: number;
  keyword?: string;
}

export class GetUserFavoriteListHandler {
  static async handle(
    requester: IRequester,
    { page, pageSize, keyword }: IGetUserFavoriteListDTO
  ) {
    const userEntity = await prismaClient.user.findUnique({
      where: {
        id: requester.userId,
      },
    });

    if (!userEntity) {
      throw new NotFoundException('Not Found', ExceptionMessage.USER_NOT_FOUND);
    }

    const whereClause = {
      likes: {
        some: {
          userId: requester.userId,
        },
      },
      ...(keyword && {
        name: {
          contains: keyword,
        },
      }),
    };

    const favoriteProductCount = await prismaClient.product.count({
      where: whereClause,
    });

    const favoriteProductsEntities = await prismaClient.product.findMany({
      where: whereClause,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const favoriteProducts = favoriteProductsEntities.map(
      (entity) => new Product(entity)
    );

    return {
      totalCount: favoriteProductCount,
      list: favoriteProducts.map((product) => ({
        id: product.getId(),
        ownerId: product.getOwnerId(),
        name: product.getName(),
        description: product.getDescription(),
        price: product.getPrice(),
        tags: product.getTags(),
        images: product.getImages(),
        createdAt: product.getCreatedAt(),
      })),
    };
  }
}
