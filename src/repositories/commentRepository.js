import prisma from "../config/client.prisma.js";

async function getById(commentId) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });
  return comment;
}

async function update(id, comment) {
  const updatedComment = await prisma.comment.update({
    where: { id },
    data: {
      content: comment.content,
    },
  });
  return updatedComment;
}

async function deleteById(id) {
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
