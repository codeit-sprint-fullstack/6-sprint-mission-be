// src/controllers/auth.controller.js
const authService = require("../services/auth.service.js");
const catchAsync = require("../utils/catchAsync.js");

exports.signUp = catchAsync(async (req, res) => {
  const { user, token } = await authService.signUp(req.body);
  res.status(201).send({ user, token });
});

exports.signIn = catchAsync(async (req, res) => {
  const { user, token } = await authService.signIn(
    req.body.email,
    req.body.password
  );
  res.send({ user, token });
});

exports.refreshToken = catchAsync(async (req, res) => {
  const token = await authService.refreshToken(req.body.refreshToken);
  res.send({ token });
});
