import articleService from "../services/articleService.js";

// 게시글 생성
export async function createArticle(req, res, next) {
  try {
    const { title, content } = req.body;
    const userId = req.auth.userId;

    if (!title || !content) {
      return res.status(400).json({ message: "제목과 내용은 필수입니다." });
    }

    const article = await articleService.createArticle({
      title,
      content,
      userId,
    });

    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
}

// 게시글 목록 조회
export async function getAllArticles(req, res, next) {
  try {
    const articles = await articleService.getAllArticles();
    res.json({
      data: articles,
      total: articles.length,
    });
  } catch (err) {
    next(err);
  }
}

// 게시글 상세 조회
export async function getArticleById(req, res, next) {
  try {
    const id = Number(req.params.articleId);
    const userId = req.auth?.userId || null;

    const article = await articleService.getArticleById(id, userId);

    if (!article) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    res.json(article);
  } catch (err) {
    next(err);
  }
}

// 게시글 수정
export async function updateArticle(req, res, next) {
  try {
    const id = Number(req.params.articleId);
    const { title, content } = req.body;
    const userId = req.auth.userId;

    if (!title && !content) {
      return res.status(400).json({ message: "수정할 내용이 없습니다." });
    }

    const updated = await articleService.updateArticle({
      id,
      userId,
      title,
      content,
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// 게시글 삭제
export async function deleteArticle(req, res, next) {
  try {
    const id = Number(req.params.articleId);
    const userId = req.auth.userId;

    await articleService.deleteArticle(id, userId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

// 게시글 좋아요
export async function likeArticle(req, res, next) {
  try {
    const articleId = Number(req.params.articleId);
    const userId = req.auth.userId;

    const result = await articleService.likeArticle(articleId, userId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// 게시글 좋아요 취소
export async function unlikeArticle(req, res, next) {
  try {
    const articleId = Number(req.params.articleId);
    const userId = req.auth.userId;

    const result = await articleService.unlikeArticle(articleId, userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
