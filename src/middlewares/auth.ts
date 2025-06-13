import { expressjwt } from "express-jwt";
import commentRepository from "../repositories/commentRepository.js";
import { NextFunction, Response, Request } from "express";
import { ForbiddenError, NotFoundError } from "../types/errors.js";

//인증된 사용자인지 검증
const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET_KEY!,
  algorithms: ["HS256"],
});

//작성자만 UD 가능
async function verifyCommentAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const commentId = Number(req.params.id);
  try {
    const comment = await commentRepository.getById(commentId);

    if (!comment) throw new NotFoundError("존재하지 않는 댓글입니다");

    if (!req.auth) throw new NotFoundError("작성자를 찾을 수 없습니다.");

    if (comment.authorId !== req.auth.userId) {
      throw new ForbiddenError("작성자만 권한이 있습니다");
    }
    next();
  } catch (error) {
    return next(error);
  }
}

export default {
  verifyAccessToken,
  verifyCommentAuth,
};
