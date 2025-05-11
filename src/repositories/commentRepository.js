import { prisma } from "../db/prisma/client.prisma.js";

// 댓글 목록 조회
async function findByArticleId(articleId) {
  return prisma.comment.findMany({
    where: { articleId },
    orderBy: { createdAt: "desc" },
  });
}

// 댓글 생성
async function create(data) {
  return prisma.comment.create({ data });
}

// 댓글 수정
async function update(id, data) {
  return prisma.comment.update({
    where: { id },
    data,
  });
}

// 댓글 삭제
async function remove(id) {
  return prisma.comment.delete({
    where: { id },
  });
}

export default {
  findByArticleId,
  create,
  update,
  remove,
};
