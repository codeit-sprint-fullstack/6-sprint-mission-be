export interface UserDTO {
  id: number;
  nickname: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserDTO;
    }
  }
}