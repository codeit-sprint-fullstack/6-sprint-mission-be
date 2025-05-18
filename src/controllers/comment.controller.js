import prisma from "../db/prisma/client.js";

// ✅ 댓글 목록 조회
export const getComments = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);

    const comments = await prisma.comment.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      include: {
        writer: {
          select: {
            id: true,
            userName: true,
          },
        },
      },
    });

    res.json({ list: comments });
  } catch (error) {
    console.error("댓글 목록 조회 오류:", error);
    res.status(500).json({ message: "댓글 조회 실패" });
  }
};

// ✅ 댓글 작성
export const createComment = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const userId = req.user.id;
    const { content } = req.body;

    const comment = await prisma.comment.create({
      data: {
        content,
        productId,
        userId,
      },
      include: {
        writer: {
          select: {
            id: true,
            userName: true,
          },
        },
      },
    });

    res.status(201).json({ comment });
  } catch (error) {
    console.error("댓글 작성 오류:", error);
    res.status(500).json({ message: "댓글 작성 실패" });
  }
};

// ✅ 댓글 수정
export const updateComment = async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId);
    const { content } = req.body;

    const existing = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existing || existing.userId !== req.user.id) {
      return res.status(403).json({ message: "수정 권한이 없습니다." });
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    res.json({ comment: updated });
  } catch (error) {
    console.error("댓글 수정 오류:", error);
    res.status(500).json({ message: "댓글 수정 실패" });
  }
};

// ✅ 댓글 삭제
export const deleteComment = async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId);

    const existing = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existing || existing.userId !== req.user.id) {
      return res.status(403).json({ message: "삭제 권한이 없습니다." });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    res.json({ message: "댓글 삭제 성공" });
  } catch (error) {
    console.error("댓글 삭제 오류:", error);
    res.status(500).json({ message: "댓글 삭제 실패" });
  }
};
