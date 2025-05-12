import authRepository from "../repositories/authRepository.js";
import jwt from "jsonwebtoken";

async function create(user) {
  return await authRepository.save(user);
}

function createToken(user) {
  const secretKey = `${process.env.JWT_SECRET_KEY}`;

  const payload = { userId: user.id };
  const token = jwt.sign(payload, secretKey, {
    expiresIn: "1h",
  });
  return token;
}

async function getByEmail(user) {
  return await authRepository.findByEmail(user);
}

export default {
  create,
  createToken,
  getByEmail,
};
