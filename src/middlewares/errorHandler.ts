import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const status = err.code ?? 500;

  console.error(err);

  res.status(status).json({
    path: req.path,
    method: req.method,
    message: err.message ?? "서버 오류입니다.",
    data: err.data ?? undefined,
    date: new Date(),
  });
};

export default errorHandler;
