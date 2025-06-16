import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

// JWT 토큰 발급
export function createToken(
  user: Pick<User, "id" | "nickname" | "image">,
  type: string = "accessToken"
) {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: type === "accessToken" ? "30m" : "1day",
  });

  return token;
}
