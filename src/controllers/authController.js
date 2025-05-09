import * as authService from '../services/authService.js';

export const signUp = async (req, res) => {
    const { email, nickname, password, passwordConfirmation } = req.body;
    const article = await authService.signUp({ email, nickname, password, passwordConfirmation });
    res.status(201).json(article);
};

export const signIn = async (req, res) => {
    const { email, password } = req.body;
    const article = await authService.signIn({ email, password });
    res.status(201).json(article);
};

export const refreshAccessToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new HttpError(400, '리프레시 토큰이 필요합니다');
        }

        const result = await authService.refreshAccessToken(refreshToken);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
