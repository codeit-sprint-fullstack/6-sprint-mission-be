import commentRepository from "../repositories/commentRepository.js";

async function create(comment) {
  return commentRepository.save(comment);
}

async function getById(id) {
  return commentRepository.getById(id);
}

async function getAll() {
  return commentRepository.getAll();
}

async function update(id, review) {
  return commentRepository.update(id, review);
}

async function deleteById(id) {
  return commentRepository.deleteById(id);
}

export default {
  create,
  getById,
  getAll,
  update,
  deleteById,
};
