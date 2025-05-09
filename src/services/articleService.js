import articleRepository from "../repositories/articleRepository.js";

async function create(article) {
  return articleRepository.save(article);
}

async function getById(id) {
  return articleRepository.getById(id);
}

async function getAll() {
  return articleRepository.getAll();
}

async function update(id, review) {
  return articleRepository.update(id, review);
}

async function deleteById(id) {
  return articleRepository.deleteById(id);
}

async function createArticleComment(comment) {
  return articleRepository.saveArticleComment(comment);
}

async function getAllArticleComment(id) {
  return articleRepository.getAllArticleComment(id);
}

export default {
  create,
  getById,
  getAll,
  update,
  deleteById,
  createArticleComment,
  getAllArticleComment,
};
