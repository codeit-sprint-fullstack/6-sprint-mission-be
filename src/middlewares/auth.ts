import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { AuthRequest } from '../Types/user';

const auth = {
  verifyAccessToken: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new Error('No token provided');
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new Error('No token provided');
      }

      const decoded = verifyToken(token, process.env.JWT_SECRET!);
      req.auth = { userId: decoded.userId };
      next();
    } catch (error) {
      next(error);
    }
  },
};

export default auth; 