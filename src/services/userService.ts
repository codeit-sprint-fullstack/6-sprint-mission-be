import { User } from "@prisma/client";
import userRepository from "../repositories/userRepository.js";

async function getById(id: User["id"]) {
  return await userRepository.findById(id);
}

export default {
  getById,
};
