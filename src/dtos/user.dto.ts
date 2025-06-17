export interface UserResponse {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
} 