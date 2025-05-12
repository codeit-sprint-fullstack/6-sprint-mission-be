import jwt from "jsonwebtoken";

export function generateAccessToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    nickname: user.nickname,
  };

  const secretKey = `${process.env.JWT_SECRET_KEY}`;

  if (!secretKey) {
    console.error("JWT_SECRET_KEY가 .env 파일에 없거나 비어 있습니다.");
    throw new Error("시크릿키를 확인하세요");
  }

  const expiresIn = "1h";

  const token = jwt.sign(payload, secretKey, { expiresIn });

  return token;
}

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "인증이 필요합니다." });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
}
