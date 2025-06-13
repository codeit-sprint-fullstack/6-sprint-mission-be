import prisma from "../config/client.prisma.js";
import { Comment } from "@prisma/client";

async function getById(commentId: Comment["id"]) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });
  return comment;
}

async function update(id: Comment["id"], comment: Comment) {
  const updatedComment = await prisma.comment.update({
    where: { id },
    data: {
      content: comment.content,
    },
  });
  return updatedComment;
}

async function deleteById(id: Comment["id"]) {
  const deletedComment = await prisma.comment.delete({
    where: { id },
  });
  return deletedComment;
}
export default {
  getById,
  update,
  deleteById,
};
