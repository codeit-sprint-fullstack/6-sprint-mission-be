import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import prisma from '../models/prisma/prismaClient';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/apiError';

interface DecodedToken {
  userId: number;
}

const auth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let accessToken: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    accessToken = req.headers.authorization.split(' ')[1];
  }

  if (!accessToken) {
    throw new ApiError(401, 'Please authenticate');
  }

  try {
    const decoded = jwt.verify(accessToken, config.jwtSecret) as DecodedToken;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    (req as any).user = user;
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid token');
  }
});

export default auth;