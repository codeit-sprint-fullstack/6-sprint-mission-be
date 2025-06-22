import prisma from "../config/prisma";

// 댓글 생성
export async function createComment(data: {
  content: string;
  productId: number;
  userId: number;
}) {
  return prisma.comment.create({
    data,
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
  });
}

// 상품별 댓글 목록 조회
export async function getCommentsByProductId(productId: number) {
  const comments = await prisma.comment.findMany({
    where: {
      productId,
    },
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 응답 데이터 가공
  const formattedComments = comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    productId: comment.productId,
    userId: comment.userId,
    createdAt: comment.createdAt,
    // 명시적으로 작성자 정보 포함
    writer: {
      id: comment.user.id,
      nickname: comment.user.nickname,
    },
    // 추가 필드
    authorNickname: comment.user.nickname,
  }));

  return {
    list: formattedComments,
    totalCount: comments.length,
  };
}

// 댓글 수정
export async function updateComment(data: {
  id: number;
  content: string;
  userId: number;
}) {
  const { id, content, userId } = data;
  // 댓글 소유자 확인
  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    const error = new Error("댓글을 찾을 수 없습니다.") as Error & {
      code?: number;
    };
    error.code = 404;
    throw error;
  }

  if (comment.userId !== userId) {
    const error = new Error("댓글을 수정할 권한이 없습니다.") as Error & {
      code?: number;
    };
    error.code = 403;
    throw error;
  }

  return prisma.comment.update({
    where: { id },
    data: { content },
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
  });
}

// 댓글 삭제
export async function deleteComment(id: number, userId: number) {
  // 댓글 소유자 확인
  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    const error = new Error("댓글을 찾을 수 없습니다.") as Error & {
      code?: number;
    };
    error.code = 404;
    throw error;
  }

  if (comment.userId !== userId) {
    const error = new Error("댓글을 삭제할 권한이 없습니다.") as Error & {
      code?: number;
    };
    error.code = 403;
    throw error;
  }

  return prisma.comment.delete({
    where: { id },
  });
}

export default {
  createComment,
  getCommentsByProductId,
  updateComment,
  deleteComment,
};
