import prisma from "../config/prisma.js";

async function getComment(id) {
  return prisma.comment.findUnique({
    where: {
      id,
    },
  });
}

async function getComments() {
  return await prisma.comment.findMany();
}

async function save(data) {
  return prisma.comment.create({
    data: data,
  });
}

async function update(commentId, data) {
  return prisma.comment.update({
    where: {
      id: commentId,
    },
    data: data,
  });
}

export default {
  getComment,
  getComments,
  save,
  update,
};
