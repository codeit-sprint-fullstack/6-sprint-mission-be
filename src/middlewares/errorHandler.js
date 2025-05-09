export default function errorHandler(error, req, res, next) {
  if (error.name === "UnauthorizedError") {
    res.status(401).send("invalid token...");
  }
  const status = error.code ?? 500;

  console.error(error);
  return res.status(status).json({
    message: error.message ?? "Internal Server Error",
    details: error.data ?? undefined,
  });
}
