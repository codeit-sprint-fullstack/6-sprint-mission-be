import productRepository from "../repositories/productRepository";
import commentRepository from "../repositories/commentRepository";
import articleRepository from "../repositories/articleRepository";
import { Request, Response, NextFunction } from "express";
import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository";
import { AuthenticationError } from "../types/errors";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET 환경 변수가 정의되지 않았습니다.");
}
if (!process.env.JWT_REFRESH_SECRET) {
  throw new Error("JWT_REFRESH_SECRET 환경 변수가 정의되지 않았습니다.");
}

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  getToken: (req: Request) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.split(" ")[1];
    }
    return undefined;
  },
});

const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_REFRESH_SECRET,
  algorithms: ["HS256"],
  getToken: (req: Request) => {
    return req.cookies.refreshToken || undefined;
  },
});

const checkPostOwner = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const postId = parseInt(req.params.id);
  const post = await articleRepository.getById(postId);

  if (!post) {
    return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
  }

  if (post.authorId !== (req as any).auth?.id) {
    return res
      .status(403)
      .json({ message: "작성자만 수정/삭제할 수 있습니다." });
  }

  next();
};

const checkProductOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productId = req.params.id;
  const product = await productRepository.getById(parseInt(productId));

  if (!product) {
    return res.status(404).json({ message: "상품이 존재하지 않습니다." });
  }

  if (product.authorId !== (req as any).auth?.id) {
    return res
      .status(403)
      .json({ message: "작성자만 수정/삭제할 수 있습니다." });
  }

  next();
};

const checkCommentOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = parseInt(req.params.id);
    const comment = await commentRepository.getById(commentId);

    if (!comment) {
      res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
      return;
    }

    if (comment.authorId !== (req as any).auth?.id) {
      res.status(403).json({ message: "댓글 수정 권한이 없습니다." });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

const auth = {
  verifyAccessToken: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const error = new AuthenticationError("액세스 토큰이 필요합니다.");
        throw error;
      }

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET 환경변수가 설정되지 않았습니다.");
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;

      (req as any).auth = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
      };

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        const authError = new AuthenticationError("유효하지 않은 토큰입니다.");
        next(authError);
      } else {
        next(error);
      }
    }
  },

  verifyRefreshToken: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        const error = new AuthenticationError("리프레시 토큰이 필요합니다.");
        throw error;
      }

      if (!process.env.JWT_REFRESH_SECRET) {
        throw new Error("JWT_REFRESH_SECRET 환경변수가 설정되지 않았습니다.");
      }

      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      ) as any;
      const user = await userRepository.findById(decoded.id);

      if (!user || user.refreshToken !== refreshToken) {
        const error = new AuthenticationError(
          "유효하지 않은 리프레시 토큰입니다."
        );
        throw error;
      }

      (req as any).auth = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
      };

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        const authError = new AuthenticationError("유효하지 않은 토큰입니다.");
        next(authError);
      } else {
        next(error);
      }
    }
  },

  checkPostOwner: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const postId = parseInt(req.params.id);
      const post = await articleRepository.getById(postId);

      if (!post) {
        res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
        return;
      }

      if (post.authorId !== (req as any).auth?.id) {
        res.status(403).json({ message: "게시글 수정 권한이 없습니다." });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  },

  checkProductOwner: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const productId = parseInt(req.params.id);
      const product = await productRepository.getById(productId);

      if (!product) {
        res.status(404).json({ message: "상품을 찾을 수 없습니다." });
        return;
      }

      if (product.authorId !== (req as any).auth?.id) {
        res.status(403).json({ message: "상품 수정 권한이 없습니다." });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  },

  checkCommentOwner: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const commentId = parseInt(req.params.id);
      const comment = await commentRepository.getById(commentId);

      if (!comment) {
        res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
        return;
      }

      if (comment.authorId !== (req as any).auth?.id) {
        res.status(403).json({ message: "댓글 수정 권한이 없습니다." });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  },
};

export default auth;
