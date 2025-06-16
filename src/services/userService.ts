import { User } from "@prisma/client";
import userRepository from "../repositories/userRepository";

async function getById(id: User["id"]) {
  return await userRepository.findById(id);
}

export default {
  getById,
};
