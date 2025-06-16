import prisma from "../config/client.prisma";

const findAll = async (query, articleId, articleCommentId) => {
  const { limit, cursor } = query;

  return await prisma.articleComment.findMany({
    where: { articleId },
    skip: articleCommentId ? 1 : undefined,
    take: Number(limit) || 10,
    cursor: articleCommentId ? { id: Number(cursor) } : undefined,
    omit: { articleId: true, authorId: true },
    include: { author: { select: { id: true, nickname: true } } },
  });
};

const findByCursor = async (articleId, cursor) => {
  return await prisma.articleComment.findFirst({
    where: { articleId, id: Number(cursor) },
  });
};

const createArticleComment = async (
  authorId,
  articleId,
  content,
  options = {}
) => {
  const { tx } = options;
  const client = tx || prisma;

  return await client.articleComment.create({
    data: { authorId, articleId, content },
  });
};

export default {
  findAll,
  findByCursor,
  createArticleComment,
};
