import commentRepository from "../repositories/commentRepository.js";

async function update(id, review) {
  return commentRepository.update(id, review);
}

async function deleteById(id) {
  return commentRepository.deleteById(id);
}

export default {
  update,
  deleteById,
};
