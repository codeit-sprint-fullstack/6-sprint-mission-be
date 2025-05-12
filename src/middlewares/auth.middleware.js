// src/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");
const config = require("../config/config.js");
const prisma = require("../repositories/prisma/prismaClient.js");
const catchAsync = require("../utils/catchAsync.js");
const ApiError = require("../utils/apiError.js");

const auth = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Please authenticate");
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      throw new ApiError(401, "User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid token");
  }
});

module.exports = auth;
