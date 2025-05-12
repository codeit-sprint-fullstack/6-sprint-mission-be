/**
 * 게시글 목록 조회
 */
export async function getArticles(req, res, next) {
  try {
    const offset = Number(req.query.offset);
    const search = req.query.search;

    const options = {};

    options.orderBy = { createdAt: "desc" };

    if (offset) options.skip = offset;

    if (search)
      options.where = {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      };

    const articles = await prisma.article.findMany(options);

    res.json(articles);
  } catch (e) {
    next(e);
  }
}

/**
 * 게시글 등록
 */
export async function createArticle(req, res, next) {
  try {
    const data = req.body;
    const { title, content } = data;
    if (!title || !content)
      throw new Error("게시글 제목과 내용을 입력해주세요.");

    const article = await prisma.article.create({ data: { title, content } });

    res.status(201).json(article);
  } catch (e) {
    next(e);
  }
}

/**
 * 게시글 조회
 */
export async function getArticle(req, res, next) {
  try {
    const articleId = Number(req.params.articleId);
    if (isNaN(articleId)) throw new Error("게시글 Id는 숫자여야 합니다.");

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
    if (!article) throw new Error("게시글을 찾을 수 없습니다.");

    res.json(article);
  } catch (e) {
    next(e);
  }
}

/**
 * 게시글 수정
 */
export async function updateArticle(req, res, next) {
  try {
    const articleId = Number(req.params.articleId);
    const data = req.body;
    const { title, content } = data;

    if (isNaN(articleId)) throw new Error("게시글 Id는 숫자여야 합니다.");

    await prisma.$transaction(async (tx) => {
      const article = await tx.article.update({
        where: { id: articleId },
        data: { title, content },
      });

      res.json(article);
    });
  } catch (e) {
    next(e);
  }
}

/**
 * 게시글 삭제
 */
export async function deleteArticle(req, res, next) {
  try {
    const articleId = Number(req.params.articleId);
    if (!articleId) throw new Error("게시글을 찾을 수 없습니다.");

    await prisma.article.delete({ where: { id: articleId } });

    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

/**
 * 게시글 좋아요
 */
export async function likeArticle(req, res, next) {
  try {
    const articleId = +req.params.articleId;
    const userId = req.auth.userId;
    const article = await productService.likeProduct(articleId, userId);
    if (!product) throw new NotFoundError("게시글을 찾을 수 없습니다.");
    res.json({ ...article, isFavorite: true });
  } catch (e) {
    next(e);
  }
}

/**
 * 게시글 좋아요 취소
 */
export async function unlikeArticle(req, res, next) {
  try {
    const articleId = +req.params.articleId;
    const userId = req.auth.userId;
    const article = await productService.unlikeProduct(articleId, userId);
    if (!article) throw new NotFoundError("게시글을 찾을 수 없습니다.");
    res.json({ ...article, isFavorite: false });
  } catch (e) {
    next(e);
  }
}
