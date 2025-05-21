import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "panda-secret";

export function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: "7d",
  });
}
