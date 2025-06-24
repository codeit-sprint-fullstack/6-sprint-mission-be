import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ValidationError } from "../types/errors";

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof ValidationError) {
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
