// src/controllers/comment.controller.js
const prisma = require("../models/prisma/prismaClient.js");
const catchAsync = require("../utils/catchAsync.js");

exports.createProductComment = catchAsync(async (req, res) => {
  const newComment = await prisma.comment.create({
    data: {
      content: req.body.content,
      userId: req.user.id,
      productId: parseInt(req.params.productId),
    },
  });
  res.status(201).send(newComment);
});

exports.getProductComments = catchAsync(async (req, res) => {
  const comments = await prisma.comment.findMany({
    where: { productId: parseInt(req.params.productId) },
    include: { user },
  });
  res.send(comments);
});

exports.createArticleComment = catchAsync(async (req, res) => {
  const newComment = await prisma.comment.create({
    data: {
      content: req.body.content,
      userId: req.user.id,
      articleId: parseInt(req.params.articleId), // Article 모델에 comment 관계 추가 필요
    },
  });
  res.status(201).send(newComment);
});

exports.getArticleComments = catchAsync(async (req, res) => {
  const comments = await prisma.comment.findMany({
    where: { articleId: parseInt(req.params.articleId) }, // Article 모델에 comment 관계 추가 필요
    include: { user },
  });
  res.send(comments);
});

exports.updateComment = catchAsync(async (req, res) => {
  const updatedComment = await prisma.comment.update({
    where: { id: parseInt(req.params.commentId) },
    data: req.body,
  });
  res.send(updatedComment);
});

exports.deleteComment = catchAsync(async (req, res) => {
  await prisma.comment.delete({
    where: { id: parseInt(req.params.commentId) },
  });
  res.status(204).send();
});
