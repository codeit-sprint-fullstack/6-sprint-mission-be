// src/controllers/comment.controller.js
const commentService = require("../services/comment.service.js");
const catchAsync = require("../utils/catchAsync.js");

exports.createProductComment = catchAsync(async (req, res) => {
  const newComment = await commentService.createProductComment(
    req.body.content,
    req.user.id,
    parseInt(req.params.productId)
  );
  res.status(201).send(newComment);
});

exports.getProductComments = catchAsync(async (req, res) => {
  const comments = await commentService.getProductComments(
    parseInt(req.params.productId),
    { user }
  );
  res.send(comments);
});

exports.createArticleComment = catchAsync(async (req, res) => {
  const newComment = await commentService.createArticleComment(
    req.body.content,
    req.user.id,
    parseInt(req.params.articleId)
  );
  res.status(201).send(newComment);
});

exports.getArticleComments = catchAsync(async (req, res) => {
  const comments = await commentService.getArticleComments(
    parseInt(req.params.articleId),
    { user }
  );
  res.send(comments);
});

exports.updateComment = catchAsync(async (req, res) => {
  const updatedComment = await commentService.updateComment(
    parseInt(req.params.commentId),
    req.body
  );
  res.send(updatedComment);
});

exports.deleteComment = catchAsync(async (req, res) => {
  await commentService.deleteComment(parseInt(req.params.commentId));
  res.status(204).send();
});
