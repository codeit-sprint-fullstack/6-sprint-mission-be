import prisma from "../config/client.prisma";
import { Comment, User } from "@prisma/client";

async function getById(id: Comment["id"]) {
  return await prisma.comment.findUnique({
    where: { id },
  });
}

async function save(
  type: "items" | "articles",
  id: Comment["id"],
  userId: User["id"],
  content: Comment["content"]
) {
  if (type === "items") {
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

async function edit(id: Comment["id"], comment: Pick<Comment, "content">) {
  return await prisma.comment.update({
    where: { id },
    data: {
      content: comment.content,
    },
  });
}

async function remove(id: Comment["id"]) {
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
