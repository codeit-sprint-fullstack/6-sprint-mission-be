import userRepository from "../repositories/userRepository.js";

async function getById(id) {
  return await userRepository.findById(id);
}

export default {
  getById,
};
