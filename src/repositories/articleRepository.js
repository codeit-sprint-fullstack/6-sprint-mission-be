import prisma from "../config/client.prisma";

const findAll = (query) => {
  const { offset, limit, orderBy, keyword } = query;
  const filter = {
    OR: [
      { title: { contains: keyword || "", mode: "insensitive" } },
      { content: { contains: keyword || "", mode: "insensitive" } },
    ],
  };
  const orderByCondition =
    orderBy === "recent"
      ? { createdAt: "desc" }
      : { articleLikes: { _count: "desc" } };

  return Promise.all([
    prisma.article.findMany({
      where: filter,
      skip: (Number(offset) - 1) * Number(limit) || 0,
      take: Number(limit) || 10,
      orderBy: orderByCondition,
      omit: { updatedAt: true, authorId: true },
      include: { author: { select: { nickname: true } } },
    }),
    prisma.article.count({ where: filter }),
  ]);
};

const findArticleLikeCountById = (articleId) => {
  return prisma.articleLike.count({ where: { articleId } });
};

const findById = (userId, articleId) => {
  return Promise.all([
    prisma.article.findUnique({
      where: { id: articleId },
      omit: { updatedAt: true, authorId: true },
      include: { author: { select: { id: true, nickname: true } } },
    }),
    prisma.articleLike.count({
      where: { articleId },
    }),
    prisma.articleLike.findUnique({
      where: { userId_articleId: { userId, articleId } },
    }),
  ]);
};

const findByIdWithTx = (tx, articleId) => {
  return tx.article.findUnique({
    where: { id: articleId },
  });
};

const create = (userId, body) => {
  const { title, content } = body;

  return prisma.article.create({
    data: { title, content, authorId: userId },
  });
};

const updateWithTx = (tx, articleId, body) => {
  const { title, content } = body;

  return tx.article.update({
    where: { id: articleId },
    data: { title, content },
  });
};

const deleteWithTx = (tx, articleId) => {
  return tx.article.delete({
    where: { id: articleId },
  });
};

const addlikeArticle = (userId, articleId) => {
  return prisma.articleLike.create({ data: { userId, articleId } });
};

const cancelLikeArticle = (userId, articleId) => {
  return prisma.articleLike.delete({
    where: { userId_articleId: { userId, articleId } },
  });
};

export default {
  findAll,
  findArticleLikeCountById,
  findById,
  findByIdWithTx,
  create,
  updateWithTx,
  deleteWithTx,
  addlikeArticle,
  cancelLikeArticle,
};
