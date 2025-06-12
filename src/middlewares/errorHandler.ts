// 추가 검토
import { ErrorRequestHandler } from "express";
import { HttpError, UnauthorizedError } from "../types/exceptions";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const httpError = toHttpError(err);
  res.status(httpError.status).json({
    message: httpError.message,
    details: httpError.details ?? undefined,
  });
};

// 예외를 HttpError 형태로 변환
function toHttpError(error: any) {
  if (error instanceof HttpError) return error;
  if (error.name === "UnauthorizedError") {
    return new UnauthorizedError(error.message);
  }
  return new HttpError(500, error.message || "Internal server error");
}

export default errorHandler;
