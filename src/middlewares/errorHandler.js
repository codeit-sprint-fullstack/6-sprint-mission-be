export default function errorHandler(err, req, res, next) {
  const status = err.code ?? 500;

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "토큰이 유효하지 않습니다." });
  }

  return res.status(status).json({
    path: req.path,
    method: req.method,
    message: err.message ?? "서버 오류입니다.",
    data: err.data ?? undefined,
    date: new Date(),
  });
}
