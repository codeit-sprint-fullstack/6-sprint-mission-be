// src/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");
const config = require("../config/config.js");
const prisma = require("../models/prisma/prismaClient.js");
const catchAsync = require("../utils/catchAsync.js");
const ApiError = require("../utils/apiError.js");

const auth = catchAsync(async (req, res, next) => {
  let accessToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];
  }

  if (!accessToken) {
    throw new ApiError(401, "Please authenticate");
  }

  try {
    const decoded = jwt.verify(accessToken, config.jwtSecret);
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
