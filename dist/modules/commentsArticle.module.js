"use strict";
// /********************************
//  * 게시글 관련 댓글 코드입니다
//  ********************************/
// import express, { NextFunction, Request, Response } from "express";
// import prisma from "../config/client.prisma.js";
// import auth from "../middlewares/auth.js";
// const articleCommentsRouter = express.Router();
// /**
//  * 댓글 등록
//  */
// articleCommentsRouter.post(
//   "/articles/:articleId/comments",
//   auth.verifyAccessToken,
//   async (req, res, next) => {
//     try {
//       const articleId = Number(req.params.articleId);
//       const { content,  } = req.body;
//       const { userId:authorId } = req.auth!;
//       if (!articleId) throw new Error("존재하지 않는 게시글입니다");
//       const comment = await prisma.comment.create({
//         data: { content, articleId, authorId },
//       });
//       res.json(comment);
//     } catch (e) {
//       next(e);
//     }
//   }
// );
// /**
//  * 댓글 목록 조회
//  */
// articleCommentsRouter.get(
//   "/articles/:articleId/comments",
//   async (req:Request<{articleId:string}>, res:Response, next:NextFunction) => {
//     try {
//       const articleId = Number(req.params.articleId)
//       if (!articleId) throw new Error("존재하지 않는 게시글입니다.");
//       const comments = await prisma.comment.findMany({
//         where: { articleId },
//       });
//       if (comments.length === 0) return res.json([]);
//       res.json(comments);
//     } catch (e) {
//       next(e);
//     }
//   }
// );
// /**
//  * 댓글 수정
//  */
// articleCommentsRouter.patch("/comments/:commentId", async (req, res, next) => {
//   try {
//     const commentId = Number(req.params.commentId);
//     const existingComment = await prisma.comment.findUnique({
//       where: { id: commentId },
//     });
//     if (!existingComment) return res.json("존재하지 않는 댓글입니다...");
//     const { content } = req.body;
//     const comment = await prisma.comment.update({
//       where: { id: commentId },
//       data: { content },
//     });
//     res.json(comment);
//   } catch (e) {
//     next(e);
//   }
// });
// /**
//  * 댓글 삭제
//  */
// articleCommentsRouter.delete("/comments/:commentId", async (req, res, next) => {
//   try {
//     const commentId = Number(req.params.commentId);
//     const existingComment = await prisma.comment.findUnique({
//       where: { id: commentId },
//     });
//     if (!existingComment)
//       return res.status(404).json("존재하지 않는 댓글은 삭제할 수 없습니다..");
//     await prisma.comment.delete({ where: { id: commentId } });
//     res.status(200).json("댓글이 삭제되었습니다.");
//   } catch (e) {
//     next(e);
//   }
// });
// module.exports = articleCommentsRouter;
//# sourceMappingURL=commentsArticle.module.js.map