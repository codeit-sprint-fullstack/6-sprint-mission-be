import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  // JWT 관련 에러 처리
  if (error.name === "UnauthorizedError") {
    res.status(401).json({ message: "invalid token..." });
  }

  // multer 관련 에러 처리
  if (error.name === "MulterError") {
    res.status(400).json({
      message: error.message,
      code: error.code,
    });
  }
  const status = (error as any).code ?? 500;

  console.error(error);
  res.status(status).json({
    path: req.path,
    method: req.method,
    message: error.message ?? "Internal Server Error",
    data: (error as any).data ?? undefined,
    date: new Date(),
  });
};

export default errorHandler;
