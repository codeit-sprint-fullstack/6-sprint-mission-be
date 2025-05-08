import userRepository from "../repositories/userRepository.js";
import jwt from "jsonwebtoken";

async function create(user) {
  return await userRepository.save(user);
}

function createToken(user) {
  const payload = { userId: user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
}

async function getByEmail(user) {
  return await userRepository.findByEmail(user);
}

export default {
  create,
  createToken,
  getByEmail,
};
