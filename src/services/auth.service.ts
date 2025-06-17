import bcrypt from 'bcrypt';
import userRepository from '../repositories/user.repository';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils';
import { AuthResponse, UserResponse } from '../dtos/user.dto';

const authService = {
  signup: async (email: string, password: string, nickname: string): Promise<AuthResponse> => {
    const existingUserByEmail = await userRepository.findUserByEmail(email);
    if (existingUserByEmail) {
      throw new Error('Email already exists');
    }

    const existingUserBynickname = await userRepository.findUserBynickname(nickname);
    if (existingUserBynickname) {
      throw new Error('Nickname already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepository.createUser(email, hashedPassword, nickname);

    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

    await userRepository.updateRefreshToken(newUser.id, refreshToken);

    const userResponse: UserResponse = {
      id: newUser.id,
      email: newUser.email,
      nickname: newUser.nickname,
      profileImage: newUser.profileImage,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    return {
      accessToken,
      refreshToken,
      user: userResponse,
    };
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.encryptedPassword);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await userRepository.updateRefreshToken(user.id, refreshToken);

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      accessToken,
      refreshToken,
      user: userResponse,
    };
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const user = await userRepository.findUserByRefreshToken(refreshToken);
    if (!user) {
      throw new Error('Invalid refresh token');
    }

    const accessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    await userRepository.updateRefreshToken(user.id, newRefreshToken);

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: userResponse,
    };
  },
};

export default authService; 