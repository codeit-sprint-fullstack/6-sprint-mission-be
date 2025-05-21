import prisma from "../../prisma/client.js";

async function getById(id) {
  return await prisma.comment.findUnique({
    where: { id },
  });
}

async function save(type, id, userId, content) {
  if (type === "product") {
    return await prisma.comment.create({
      data: {
        content,
        itemId: id,
        userId: userId,
      },
    });
  } else {
    return await prisma.comment.create({
      data: {
        content: content,
        articleId: id,
        userId: userId,
      },
    });
  }
}

async function edit(id, comment) {
  return await prisma.comment.update({
    where: { id },
    data: {
      content: comment.content,
    },
  });
}

async function remove(id) {
  return await prisma.comment.delete({
    where: { id },
  });
}

export default {
  getById,
  remove,
  edit,
  save,
};
