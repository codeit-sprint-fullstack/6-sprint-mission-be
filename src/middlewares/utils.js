import jwt from "jsonwebtoken";

export function generateAccessToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    nickname: user.nickname,
  };

  const accessSecret = `${process.env.JWT_SECRET_KEY}`;

  if (!accessSecret) {
    console.error("SECRET_KEY가 .env 파일에 없습니다.");
    throw new Error("시크릿키를 확인하세요");
  }

  const accessToken = jwt.sign(payload, accessSecret, { expiresIn: "1h" });

  return accessToken;
}

export function generateRefreshToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    nickname: user.nickname,
  };

  const refreshSecret = `${process.env.JWT_REFRESH_SECRET_KEY}`;

  if (!refreshSecret) {
    console.error("SECRET_KEY가 .env 파일에 없습니다.");
    throw new Error("시크릿키를 확인하세요");
  }

  const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: "2w" });

  return refreshToken;
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
