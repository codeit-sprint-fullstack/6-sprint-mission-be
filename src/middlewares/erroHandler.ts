export default function errorHandler(error, req, res, next) {
  //expressjwt를 위한 예외처리
  if (error.name === "UnauthorizedError") {
    return res.status(401).send("invalid token...");
  }

  const status = error.code ?? 500;

  console.error(error);

  return res.status(status).json({
    path: req.path,
    method: req.method,
    message: error.message ?? "Internal Server Error",
    data: error.data ?? undefined,
    date: new Date(),
  });
}

export class HttpError extends Error {
  statusCode: number;
  data?: any;

  constructor(message: string, statusCode = 500, data?: any) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
