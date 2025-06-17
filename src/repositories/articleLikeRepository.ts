import { prisma } from "../db/prisma/client.prisma";
import { UserParamsDto } from "../dtos/user.dto";
import { ArticleParamsDto } from "../dtos/article.dto";

const create = (
  userId: UserParamsDto["id"],
  articleId: ArticleParamsDto["id"]
) => {
  return prisma.articleLike.create({
    data: { userId, articleId },
  });
};

const deleteLike = (
  userId: UserParamsDto["id"],
  articleId: ArticleParamsDto["id"]
) => {
  return prisma.articleLike.delete({
    where: {
      userId_articleId: { userId, articleId },
    },
  });
};

export default {
  create,
  delete: deleteLike,
};
