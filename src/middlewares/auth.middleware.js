import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "panda-secret";

export function verifyToken(req, res, next) {
  // ✅ Authorization 헤더에서 Bearer 토큰 추출
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
}
