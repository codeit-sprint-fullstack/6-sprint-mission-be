const articleRopository = require("../repositories/articles.repository.js");

async function getAll(query) {
  return await articleRopository.getAll(query);
}

async function getById(id) {
  return await articleRopository.getById(id);
}

const articlesService = {
  getAll,
  getById,
};

module.exports = articlesService;
