import { prismaClient } from '../../infra/prismaClient.js';
import { NotFoundException } from '../../exceptions/NotFoundException.js';
import { ExceptionMessage } from '../../constant/ExceptionMessage.js';
import { Product } from '../../domain/Product.js';

interface IRequester {
  userId: number;
}

interface IGetUserProductListDTO {
  page: number;
  pageSize: number;
  keyword?: string;
}

export class GetUserProductListHandler {
  static async handle(
    requester: IRequester,
    { page, pageSize, keyword }: IGetUserProductListDTO
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
      ownerId: requester.userId,
      ...(keyword && {
        name: {
          contains: keyword,
        },
      }),
    };

    const productCount = await prismaClient.product.count({
      where: whereClause,
    });

    const productEntities = await prismaClient.product.findMany({
      where: whereClause,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const products = productEntities.map(
      (productEntity) => new Product(productEntity)
    );

    return {
      totalCount: productCount,
      list: products.map((product) => ({
        id: product.getId(),
        ownerId: product.getOwnerId(),
        name: product.getName(),
        description: product.getDescription(),
        price: product.getPrice(),
        tags: product.getTags(),
        images: product.getImages(),
        createdAt: product.getCreatedAt(),
        updatedAt: product.getUpdatedAt(),
      })),
    };
  }
}
