import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/authService';
import { HttpError } from '../middlewares/HttpError';

export const signUp = async (req: Request, res: Response) => {
    const { email, nickname, password, passwordConfirmation: repeatpassowrd } = req.body;
    const article = await authService.signUp({ email, nickname, password, repeatpassowrd });
    res.status(201).json(article);
};

export const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const article = await authService.signIn({ email, password });
    res.status(201).json(article);
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new HttpError(400, '리프레시 토큰이 필요합니다');
        }

        // const result = await authService.refreshAccessToken(refreshToken);
        // res.status(200).json(result);
        res.status(200);
    } catch (err) {
        next(err);
    }
};
