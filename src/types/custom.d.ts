// src/types/custom.d.ts (또는 global.d.ts)

export interface UserDTO {
  id: number;
  nickname: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserDTO; // 이 UserDTO와 위의 RequestWithUser의 user 타입이 일치해야 합니다.
    }
  }
}