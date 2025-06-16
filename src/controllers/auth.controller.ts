import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../models/prisma/prismaClient';
import config from '../config/config';
import ApiError from '../utils/apiError';
import catchAsync from '../utils/catchAsync';

function generateToken(userId: number): string {
  const signOptions: jwt.SignOptions = {
    expiresIn: config.jwtExpiration as jwt.SignOptions['expiresIn'],
  };

  return jwt.sign(
    { userId },
    config.jwtSecret,
    signOptions
  );
}


export const signUp = catchAsync(async (req: Request, res: Response) => {
  if (await prisma.user.findUnique({ where: { email: req.body.email } })) {
    throw new ApiError(400, 'Email already taken');
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = await prisma.user.create({
    data: { ...req.body, password: hashedPassword },
  });
  res.status(201).send(user);
});

export const signIn = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, 'Incorrect email or password');
  }
  const accessToken = generateToken(user.id);
  res.send({ accessToken, user });
});