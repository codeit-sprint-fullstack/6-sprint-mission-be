import jwt from "jsonwebtoken";

interface User {
  id: number;
  email: string;
  nickname: string;
}

interface TokenPayload {
  userId: number;
  email: string;
  nickname: string;
}

export function generateAccessToken(user: User): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    nickname: user.nickname,
  };

  const accessSecret = `${process.env.JWT_SECRET_KEY}`;

  if (!accessSecret) {
    console.error("SECRET_KEY가 .env 파일에 없습니다.");
    throw new Error("시크릿키를 확인하세요");
  }

  return jwt.sign(payload, accessSecret, { expiresIn: "1h" });
}

export function generateRefreshToken(user: User): string {
  const payload: TokenPayload = {
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

//디버깅
//express-jwt와 중복되는 검증 함수임으로 우선 추석 처리
// export function authenticate(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const authHeader = req.headers["authorization"];
//   if (!authHeader)
//     return res.status(401).json({ message: "인증이 필요합니다." });

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;
//     req.user = { id: decoded.userId as number };
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
//   }
// }
