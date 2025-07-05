import { Comment, User } from "@prisma/client";
import commentRepository from "../repositories/commentRepository";

async function createComment(
  type: "articles" | "items",
  id: Comment["id"],
  userId: User["id"],
  content: Comment["content"]
) {
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

async function getById(id: Comment["id"]) {
  return await commentRepository.getById(id);
}

async function patchComment(
  id: Comment["id"],
  comment: Pick<Comment, "content">
) {
  try {
    const updatedComment = await commentRepository.edit(id, comment);
    return updatedComment;
  } catch (error) {
    throw error;
  }
}

async function deleteComment(id: Comment["id"]) {
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
