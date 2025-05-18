import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "panda-secret";

export function optionalVerifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded; 
    } catch (e) {
    }
  }

  next();
}
