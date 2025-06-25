import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET || "panda-secret";
export function generateToken(user) {
    const payload = { id: user.id, email: user.email };
    return jwt.sign(payload, SECRET_KEY, {
        expiresIn: "7d",
    });
}
