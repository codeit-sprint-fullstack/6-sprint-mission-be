// src/controllers/auth.controller.js
const prisma = require("../models/prisma/prismaClient.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config.js");
const ApiError = require("../utils/apiError.js");
const catchAsync = require("../utils/catchAsync.js");

function generateToken(userId) {
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiration,
  });
}

exports.signUp = catchAsync(async (req, res) => {
  if (await prisma.user.findUnique({ where: { email: req.body.email } })) {
    throw new ApiError(400, "Email already taken");
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = await prisma.user.create({
    data: { ...req.body, password: hashedPassword },
  });
  res.status(201).send(user);
});

exports.signIn = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, "Incorrect email or password");
  }
  const token = generateToken(user.id);
  res.send({ token });
});

// refreshToken 기능은 제외 (더 복잡한 관리가 필요)
// exports.refreshToken = catchAsync(async (req, res) => { ... });
