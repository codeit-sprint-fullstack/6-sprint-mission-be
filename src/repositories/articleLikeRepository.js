import { prisma } from "../db/prisma/client.prisma.js";

const create = (userId, articleId) => {
  return prisma.articleLike.create({
    data: { userId, articleId },
  });
};

const deleteLike = (userId, articleId) => {
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
