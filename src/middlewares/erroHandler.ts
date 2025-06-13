import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
): void => {
  //expressjwt를 위한 예외처리
  if (error.name === "UnauthorizedError") {
    res.status(401).send("invalid token...");
    return;
  }

  const status = error.code ?? 500;

  console.error(error);

  res.status(status).json({
    path: req.path,
    method: req.method,
    message: error.message ?? "Internal Server Error",
    data: error.data ?? undefined,
    date: new Date(),
  });
};
