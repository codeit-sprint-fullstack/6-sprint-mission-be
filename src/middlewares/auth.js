import jwt from "jsonwebtoken";
import productRepository from "../repositories/productRepository.js";
import commentRepository from "../repositories/commentRepository.js";
import articleRepository from "../repositories/articleRepository.js";

/**
 * 액세스 토큰 검증 미들웨어
 */
const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "인증 정보가 없습니다." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // userId 등이 포함됨
    next();
  } catch (err) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};

/**
 * 리프레시 토큰 검증 미들웨어
 */
const verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token이 없습니다." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "유효하지 않은 refresh token입니다." });
  }
};

/**
 * 게시글 작성자인지 확인
 */
const checkPostOwner = async (req, res, next) => {
  const articleId = req.params.id;
  const post = await articleRepository.getById(articleId);

  if (!post) {
    return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
  }

  if (post.authorId !== req.user.userId) {
    return res
      .status(403)
      .json({ message: "작성자만 수정/삭제할 수 있습니다." });
  }

  next();
};

/**
 * 상품 작성자인지 확인
 */
const checkProductOwner = async (req, res, next) => {
  const productId = req.params.id;
  const product = await productRepository.getById(productId);

  if (!product) {
    return res.status(404).json({ message: "상품이 존재하지 않습니다." });
  }

  if (product.authorId !== req.user.userId) {
    return res
      .status(403)
      .json({ message: "작성자만 수정/삭제할 수 있습니다." });
  }

  next();
};

/**
 * 댓글 작성자인지 확인
 */
const checkCommentOwner = async (req, res, next) => {
  const commentId = req.params.id;
  const comment = await commentRepository.getCommentsByArticleId(commentId);

  if (!comment) {
    return res.status(404).json({ message: "댓글이 존재하지 않습니다." });
  }

  if (comment.authorId !== req.user.userId) {
    return res
      .status(403)
      .json({ message: "작성자만 수정/삭제할 수 있습니다." });
  }

  next();
};

export default {
  verifyAccessToken,
  verifyRefreshToken,
  checkPostOwner,
  checkProductOwner,
  checkCommentOwner,
};
