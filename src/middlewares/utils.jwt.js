import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
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
};

export default generateAccessToken;
