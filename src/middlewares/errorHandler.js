export default function errorHandler(err, req, res, next) {
  const status = err.code ?? 500;

  return res.status(status).json({
    path: req.path,
    method: req.method,
    message: err.message ?? "서버 오류입니다.",
    data: err.data ?? undefined,
    date: new Date(),
  });
}
