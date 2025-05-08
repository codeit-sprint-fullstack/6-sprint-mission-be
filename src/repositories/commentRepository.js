import prisma from "../config/client.prisma.js";

async function save(comment) {
  const createComment = await prisma.comment.create({
    data: {
      content: comment.content,
    },
  });
  return createComment;
}

async function getById(id) {
  const comment = await prisma.comment.findUnique({
    where: { id },
  });
  return comment;
}

async function getAll() {
  const comments = await prisma.comment.findMany();
  return comments;
}

async function update(id, comment) {
  const updatedComment = await prisma.comment.update({
    where: { id },
    data: {
      content: data.content,
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
  save,
  getById,
  getAll,
  update,
  deleteById,
};
