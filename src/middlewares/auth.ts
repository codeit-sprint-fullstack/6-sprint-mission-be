import { expressjwt } from "express-jwt";
import reviewRepository from "../repositories/reviewRepository";
import { NextFunction, Request, Response } from "express";

function throwUnauthorizedError() {
  const error = new Error("Unauthorized");
  error.code = 401;
  throw error;
}
// Authorization Header 에 Bearer {token} 형식으로 요청왔을 때 토큰 검증 동작
const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
// TODO: verifyReviewAuth 함수 추가
async function verifyReviewAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id: reviewId } = req.params;
  try {
    const review = await reviewRepository.getById(reviewId);
    if (!review) {
      const error = new Error("Review not found");
      error.code = 404;
      throw error;
    }
    if (review.authorId !== req.auth.userId) {
      const error = new Error("Forbidden");
      error.code = 403;
      throw error;
    }
    next();
  } catch (error) {
    return next(error);
  }
}

export default {
  verifyAccessToken,
  verifyReviewAuth,
};
