import userRepository from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = +process.env.SALT_ROUNDS;

const authService = {
  async signup(email, nickname, password, passwordConfirmation) {
    const existingUserByEmail = await userRepository.findUserByEmail(email);
    if (existingUserByEmail) {
      const error = new Error('이미 존재하는 이메일입니다.');
      error.code = 409;
      throw error;
    }

    const existingUserBynickname = await userRepository.findUserBynickname(nickname);
    if (existingUserBynickname) {
      const error = new Error('이미 존재하는 닉네임입니다.');
      error.code = 409;
      throw error;
    }

    if (password !== passwordConfirmation) {
      const error = new Error('비밀번호가 일치하지 않습니다.');
      error.code = 409; 
      throw error;
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await userRepository.createUser(email, hashedPassword, nickname);

    return {
      id: newUser.id,
      email: newUser.email,
      nickname: newUser.nickname,
      profile : user.profileImage,
    };
  },

  async login(email, password) {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      const error = new Error('존재하지 않는 이메일입니다.');
      error.code = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.encryptedPassword);
    if (!isPasswordValid) {
      const error = new Error('비밀번호가 일치하지 않습니다.');
      error.code = 401;
      throw error;
    }

    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profile : user.profileImage,
    };
  },

  async getUserById(userId) {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      const error = new Error('해당 ID의 사용자를 찾을 수 없습니다.');
      error.code = 404;
      throw error;
    }
    return user;
  },

  async saveRefreshToken(userId, refreshToken) {
    await userRepository.saveRefreshToken(userId, refreshToken);
  },

  async findUserByRefreshToken(refreshToken) {
    return await userRepository.findUserByRefreshToken(refreshToken);
  },

  async clearRefreshToken(refreshToken) {
    await userRepository.clearRefreshToken(refreshToken);
  },
};

export default authService;