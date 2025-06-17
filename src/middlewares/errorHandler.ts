import { ErrorRequestHandler } from "express";
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error.name === "UnauthorizedError") {
    res.status(401).send("invalid token...");
  }

  const status =
    typeof error.code === "number" && Number.isInteger(error.code)
      ? error.code
      : 500;

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
