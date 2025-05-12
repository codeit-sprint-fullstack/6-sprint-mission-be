import articleRepository from "../repositories/articleRepository.js";

/**
 * 자유게시글 등록
 */
async function create(article) {
  return await articleRepository.createArticle(article);
}

/**
 * 자유게시글 ID로 조회
 */
async function getById(id) {
  return await articleRepository.getById(id);
}

/**
 * 자유게시글 전체 조회
 */
async function getAll() {
  return await articleRepository.getAll();
}

/**
 * 자유게시글 수정
 */
async function updateById(id, article) {
  return await articleRepository.updateById(id, article);
}

/**
 * 자유게시글 삭제
 */
async function deleteById(id) {
  return await articleRepository.deleteById(id);
}

/**
 * 자유게시글 좋아요 추가
 */
async function addLike(userId, articleId) {
  return await articleRepository.addLike(userId, articleId);
}

/**
 * 자유게시글 좋아요 취소
 */
async function removeLike(userId, articleId) {
  return await articleRepository.removeLike(userId, articleId);
}

/**
 * 유저가 자유게시글에 좋아요 눌렀는지 확인
 */
async function hasUserLiked(userId, articleId) {
  return await articleRepository.hasUserLiked(userId, articleId);
}

export default {
  create,
  getById,
  getAll,
  updateById,
  deleteById,
  addLike,
  removeLike,
  hasUserLiked,
};
