import commentRepository from "../repositories/commentRepository.js";

async function createComment(type, id, userId, content) {
  try {
    const createdComment = await commentRepository.save(
      type,
      id,
      userId,
      content
    );
    return createdComment;
  } catch (error) {
    throw error;
  }
}

async function getById(id) {
  return await commentRepository.getById(id);
}

async function patchComment(id, comment) {
  try {
    const updatedComment = await commentRepository.edit(id, comment);
    return updatedComment;
  } catch (error) {
    throw error;
  }
}

async function deleteComment(id) {
  try {
    const deletedComment = await commentRepository.remove(id);
    return deletedComment;
  } catch (error) {
    throw error;
  }
}

export default {
  getById,
  patchComment,
  deleteComment,
  createComment,
};
