import commentRepository from "../repositories/commentRepository";
import { Comment } from "@prisma/client";

async function update(id: Comment["id"], comment: Comment) {
  return commentRepository.update(id, comment);
}

async function deleteById(id: Comment["id"]) {
  return commentRepository.deleteById(id);
}

export default {
  update,
  deleteById,
};
