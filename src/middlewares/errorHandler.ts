import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
const errorHandler: ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error.name === "UnauthorizedError") {
    res.status(401).send("invalid token...");
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
export default errorHandler;
