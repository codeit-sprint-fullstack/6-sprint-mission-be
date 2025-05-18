const prisma = require("../config/prismaClient.js");
const getSort = require("../utils/sort.js");
const pagination = require("../utils/pagination.js");

/**
 * 전체 GET
 */
async function getAll(query = {}) {
  // 정렬, page 설정
  const orderBy = getSort("article", query.orderBy);

  const isCursor = !!query.cursor;

  const pageOption = isCursor
    ? pagination.getCursor(query)
    : pagination.getOffset(query);

  // 전체 게시글 개수
  const totalCount = await prisma.article.count();

  // 불러올 field
  const articles = await prisma.article.findMany({
    orderBy,
    ...pageOption,
    include: {
      author: { select: { id: true, nickname: true } },
      _count: { select: { likes: true } },
    },
  });

  // network에서 불러오는 형태 가공
  const formattedApi = articles.map((article) => {
    return {
      ...article,
      likeCount: article._count.likes,
      _count: undefined,
    };
  });

  // 반환
  return { totalCount, articles: formattedApi };
}

/**
 * GET
 */
async function getById(id) {
  // 게시글 하나 불러오기
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, nickname: true } },
      _count: { select: { likes: true } },
    },
  });

  if (!article) return null;

  const { _count, ...rest } = article;

  // network에서 불러오는 형태 가공
  return { ...rest, likeCount: _count.likes };
}

async function create(article) {
  const newReview = await prisma.article.create({
    data: article,
  });

  return newReview;
}

const articlesRopository = {
  getAll,
  getById,
};

module.exports = articlesRopository;
