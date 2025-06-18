import { CommentBodyDTO } from "../dto/comment.dto";
import commentRepository from "../repositories/commentRepository";
import { Comment } from "@prisma/client";

async function update(id: Comment["id"], comment: CommentBodyDTO) {
  return commentRepository.update(id, comment.content);
}

async function deleteById(id: Comment["id"]) {
  return commentRepository.deleteById(id);
}

export default {
  update,
  deleteById,
};
