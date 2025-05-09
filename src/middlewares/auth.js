import { expressjwt } from "express-jwt";
import commentRepository from "../repositories/commentRepository.js";

//인증된 사용자인지 검증
const varifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

//작성자만 UD 가능
async function verifyCommentAuth(req, res, next) {
  const commentId = Number(req.params.id);
  try {
    const comment = await commentRepository.getById(commentId);

    if (!comment) {
      const error = new Error("존재하지 않는 댓글입니다.");
      error.code = 404;
      throw error;
    }

    if (comment.authorId !== req.auth.userId) {
      const error = new Error("작성자만 권한이 있습니다.");
      error.code = 403;
      throw error;
    }
    next();
  } catch (error) {
    return next(error);
  }
}

export default {
  varifyAccessToken,
  verifyCommentAuth,
};
