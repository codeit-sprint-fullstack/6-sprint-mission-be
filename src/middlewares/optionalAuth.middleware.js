import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "panda-secret";

export function optionalVerifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded; // ✅ 로그인된 유저 정보만 넣기
    } catch (e) {
      // 유효하지 않은 토큰은 무시하고 넘어감 (로그인 안 한 상태)
    }
  }

  next();
}
