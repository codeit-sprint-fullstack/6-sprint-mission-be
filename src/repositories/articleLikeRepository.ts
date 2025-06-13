import { Article, User } from "@prisma/client";
import { prisma } from "../db/prisma/client.prisma";

const create = (userId: User["id"], articleId: Article["id"]) => {
  return prisma.articleLike.create({
    data: { userId, articleId },
  });
};

const deleteLike = (userId: User["id"], articleId: Article["id"]) => {
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
